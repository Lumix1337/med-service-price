import logging
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.parsers.factory import ParserFactory
from app.cleaners.cleaner import DataCleaner
from app.validators.validator import RecordValidator
from app.ai.matcher import ai_matcher
from app.repositories.service_repo import service_repository
from app.schemas.schemas import RawRecordCreate
from app.models.models import RawRecord, NeedsReview, Service

logger = logging.getLogger(__name__)

class ProcessingManager:
    def __init__(self):
        self.parser_factory = ParserFactory()
        self.cleaner = DataCleaner()
        self.validator = RecordValidator()

    async def process_file(self, db: AsyncSession, file_path: str, file_type: str, source_file_id: UUID) -> None:
        """
        Main pipeline:
        Upload (Done before this step) -> Validation (File level, assumed ok if we are here)
        -> ParserFactory -> Parser -> RawRecord -> Cleaning -> Validation -> AI Matching -> Database
        """
        logger.info(f"Starting pipeline for source_file_id: {source_file_id}")
        
        # 1. ParserFactory & Parser
        parser = self.parser_factory.get_parser(file_type)
        raw_records = parser.parse(file_path, source_file_id)
        
        logger.info(f"Parsed {len(raw_records)} records from {file_path}")
        
        existing_services = await service_repository.get_multi(db, limit=1000) # Load all for MVP
        
        for raw_rec in raw_records:
            # Save RawRecord to DB (PENDING)
            db_record = RawRecord(
                source_file_id=raw_rec.source_file_id,
                raw_service_name=raw_rec.raw_service_name,
                raw_price=raw_rec.raw_price,
                status="PENDING"
            )
            db.add(db_record)
            await db.flush() # flush to get ID
            
            try:
                # 2. Cleaning
                cleaned_name = self.cleaner.clean_service_name(db_record.raw_service_name)
                cleaned_price, currency = self.cleaner.clean_price(db_record.raw_price)
                
                db_record.cleaned_service_name = cleaned_name
                db_record.cleaned_price = cleaned_price
                
                # 3. Validation
                is_valid, err_msg = self.validator.validate(cleaned_name, cleaned_price)
                if not is_valid:
                    db_record.status = "ERROR"
                    db_record.error_message = err_msg
                    continue
                
                # 4. AI Matching
                match_result = await ai_matcher.match(cleaned_name, existing_services)
                
                # 5. Database logic based on matching
                if match_result.action == 'EXACT_MATCH':
                    db_record.status = "MATCHED"
                    # Here we would create Price object linked to the clinic, but we need clinic_id
                    # For MVP, just update RawRecord status. PriceService would handle actual Price insertion.
                elif match_result.action == 'NEEDS_REVIEW':
                    db_record.status = "NEEDS_REVIEW"
                    needs_rev = NeedsReview(
                        raw_record_id=db_record.id,
                        suggested_service_id=match_result.service_id,
                        similarity_score=match_result.similarity
                    )
                    db.add(needs_rev)
                elif match_result.action == 'NEW_SERVICE':
                    db_record.status = "NEW_SERVICE"
                    # Create new service or put it somewhere for admin to approve
                    
            except Exception as e:
                db_record.status = "ERROR"
                db_record.error_message = str(e)
                logger.error(f"Error processing record {db_record.id}: {str(e)}")
                
        await db.commit()
        logger.info(f"Finished pipeline for source_file_id: {source_file_id}")

processing_manager = ProcessingManager()

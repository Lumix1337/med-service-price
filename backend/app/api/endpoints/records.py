from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID

from app.database.session import get_db
from app.schemas.schemas import RawRecordResponse
from app.models.models import RawRecord

router = APIRouter()

@router.get("/", response_model=List[RawRecordResponse])
async def get_raw_records(
    source_file_id: Optional[UUID] = None,
    job_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(RawRecord)
    if source_file_id:
        query = query.filter(RawRecord.source_file_id == source_file_id)
    # If we had job_id relationship we could filter by it, but we use source_file_id
    
    result = await db.execute(query)
    records = result.scalars().all()
    return records

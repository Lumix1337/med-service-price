from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.database.session import get_db
from app.schemas.schemas import ClinicResponse, ClinicCreate, ClinicBase
from app.repositories.clinic_repo import clinic_repository, ClinicUpdate

router = APIRouter()

@router.get("/", response_model=List[ClinicResponse])
async def read_clinics(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    clinics = await clinic_repository.get_multi(db, skip=skip, limit=limit)
    return clinics

@router.get("/{clinic_id}", response_model=ClinicResponse)
async def read_clinic(clinic_id: UUID, db: AsyncSession = Depends(get_db)):
    clinic = await clinic_repository.get(db, id=clinic_id)
    if clinic is None:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic

@router.post("/", response_model=ClinicResponse)
async def create_clinic(clinic_in: ClinicCreate, db: AsyncSession = Depends(get_db)):
    existing = await clinic_repository.get_by_slug(db, slug=clinic_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Clinic with this slug already exists")
    clinic = await clinic_repository.create(db, obj_in=clinic_in)
    return clinic

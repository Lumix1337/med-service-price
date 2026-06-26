from fastapi import FastAPI
from app.config.settings import settings
from app.core.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import clinics, jobs, upload, services, records

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Medical Service Price processing"
)

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clinics.router, prefix="/api/clinics", tags=["Clinics"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(records.router, prefix="/api/records", tags=["Records"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up FastAPI application...")

@app.get("/")
async def root():
    return {"message": "Medical Service Price API is running", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

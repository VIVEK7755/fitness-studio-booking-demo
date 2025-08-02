from datetime import datetime
from typing import List , Optional
import pytz
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import EmailStr
from sqlmodel import SQLModel, create_engine, Session, select
import uvicorn
import logging
from models import Class, ClassRead, Booking, BookingRequest, BookingRead

# Timezone
IST = pytz.timezone("Asia/Kolkata")

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ------------------------ Database ------------------------ #

DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# ------------------------ FastAPI App ------------------------ #

app = FastAPI(
    title="Fitness Studio Booking API",
    description="Simple API for booking fitness classes",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        existing = session.exec(select(Class)).first()
        if not existing:
            sample_classes = [
                Class(name="Morning Yoga", start_datetime_IST=IST.localize(datetime(2025, 8, 2, 8, 0)), available_slots=10, instructor="Alice"),
                Class(name="HIIT Training", start_datetime_IST=IST.localize(datetime(2025, 8, 2, 18, 0)), available_slots=8, instructor="Bob"),
                Class(name="Pilates", start_datetime_IST=IST.localize(datetime(2025, 8, 3, 9, 0)), available_slots=12, instructor="Charlie"),
                Class(name="CrossFit", start_datetime_IST=IST.localize(datetime(2025, 8, 3, 19, 0)), available_slots=6, instructor="David"),
                Class(name="Zumba", start_datetime_IST=IST.localize(datetime(2025, 8, 4, 10, 0)), available_slots=15, instructor="Eva"),
                Class(name="Boxing", start_datetime_IST=IST.localize(datetime(2025, 8, 4, 11, 0)), available_slots=5, instructor="Frank"),
            ]
            for cls in sample_classes:
                session.add(cls)
            session.commit()

@app.get("/classes", response_model=List[ClassRead])
def get_classes():
    with Session(engine) as session:
        classes = session.exec(select(Class)).all()
        return classes

@app.post("/book", status_code=status.HTTP_201_CREATED)
def book_class(booking: BookingRequest):
    with Session(engine) as session:
        class_obj = session.exec(select(Class).where(Class.id == booking.class_id)).first()

        if not class_obj:
            raise HTTPException(status_code=404, detail=f"Class with id {booking.class_id} not found")

        if class_obj.available_slots <= 0:
            raise HTTPException(status_code=409, detail="No available slots for this class")

        class_obj.available_slots -= 1
        session.add(class_obj)

        new_booking = Booking(
            class_id=booking.class_id,
            client_name=booking.client_name,
            client_email=booking.client_email,
            instructor=class_obj.instructor
        )
        session.add(new_booking)

        session.commit()
        session.refresh(new_booking)

        logger.info("Booking successful for %s", booking.client_email)

        return {
            "message": f"Successfully booked {class_obj.name} for {booking.client_name}",
            "class_name": class_obj.name,
            "client_name": booking.client_name,
            "remaining_slots": class_obj.available_slots
        }

@app.get("/bookings", response_model=List[BookingRead])
def get_bookings(email: Optional[EmailStr] = Query(None, description="Client email to filter bookings")):
    with Session(engine) as session:
        if email:
            bookings = session.exec(select(Booking).where(Booking.client_email == email)).all()
        else:
            bookings = session.exec(select(Booking)).all()

        results = []
        for b in bookings:
            class_obj = session.get(Class, b.class_id)
            if class_obj:
                results.append(BookingRead(
                    id=b.id,
                    class_name=class_obj.name,
                    start_datetime_IST=class_obj.start_datetime_IST,
                    client_name=b.client_name,
                    client_email=b.client_email,
                    instructor=b.instructor
                ))
        return results

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"error": "Resource not found"})

@app.exception_handler(409)
async def conflict_handler(request, exc):
    return JSONResponse(status_code=409, content={"error": "Booking conflict - no available slots"})

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

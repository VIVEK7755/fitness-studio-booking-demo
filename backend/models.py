from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, constr
from sqlmodel import Field, SQLModel



# ------------------------ Models ------------------------ #

class ClassBase(SQLModel):
    name: str
    start_datetime_IST: datetime
    instructor: str
    available_slots: int

class Class(ClassBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class ClassRead(ClassBase):
    id: int

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int
    client_name: str
    client_email: str
    instructor: str

class BookingRequest(BaseModel):
    class_id: int
    client_name: constr(min_length=2, max_length=50)
    client_email: EmailStr

class BookingRead(BaseModel):
    id: int
    class_name: str
    start_datetime_IST: datetime
    client_name: str
    client_email: EmailStr
    instructor: str
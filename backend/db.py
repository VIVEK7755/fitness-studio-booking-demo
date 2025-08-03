from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# ✅ Dependency function to be used with FastAPI Depends()
def get_session():
    with Session(engine) as session:
        yield session

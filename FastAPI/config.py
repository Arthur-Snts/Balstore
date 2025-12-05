from sqlmodel import create_engine
from models import SQLModel
from fastapi import FastAPI
from contextlib import asynccontextmanager

from seeds import run_seeds

urlsqlite = "sqlite:///balstore_db.sqlite3"

engine = create_engine(
    urlsqlite,
    connect_args={"check_same_thread": False}
)

# Ativa FK
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text("PRAGMA foreign_keys=ON"))

def get_create_db():
    SQLModel.metadata.create_all(engine)
    run_seeds(engine)

@asynccontextmanager 
async def lifespan(app:FastAPI): 
    get_create_db()
    yield

app = FastAPI(lifespan=lifespan,docs_url=None)


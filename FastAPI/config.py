from sqlmodel import create_engine
from models import SQLModel
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

urlmysql = "mysql+pymysql://root:@localhost/balstore_db"

engine = create_engine(urlmysql)

def get_create_db():
    SQLModel.metadata.create_all(engine)

@asynccontextmanager 
async def lifespan(app:FastAPI): 
    get_create_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ou ["*"] para liberar geral (menos seguro)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
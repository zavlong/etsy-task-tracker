from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
import os

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./etsy_tracker.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class WeekData(Base):
    __tablename__ = "week_data"
    
    week_key = Column(String, primary_key=True, index=True)
    completions = Column(Text, default="{}")
    listed = Column(Integer, default=0)
    sales = Column(Integer, default=0)
    revenue = Column(Integer, default=0)

Base.metadata.create_all(bind=engine)

# Pydantic models
class Stats(BaseModel):
    listed: int = 0
    sales: int = 0
    revenue: int = 0

class WeekDataModel(BaseModel):
    completions: dict = {}
    stats: Stats = Stats()

# FastAPI app
app = FastAPI(title="Etsy Tracker API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Etsy Tracker API", "status": "running"}

@app.get("/api/completions/{week_key}")
async def get_week_data(week_key: str):
    db = SessionLocal()
    try:
        week_data = db.query(WeekData).filter(WeekData.week_key == week_key).first()
        
        if not week_data:
            return {
                "completions": {},
                "stats": {"listed": 0, "sales": 0, "revenue": 0}
            }
        
        return {
            "completions": json.loads(week_data.completions),
            "stats": {
                "listed": week_data.listed,
                "sales": week_data.sales,
                "revenue": week_data.revenue
            }
        }
    finally:
        db.close()

@app.post("/api/completions/{week_key}")
async def save_week_data(week_key: str, data: WeekDataModel):
    db = SessionLocal()
    try:
        week_data = db.query(WeekData).filter(WeekData.week_key == week_key).first()
        
        if not week_data:
            week_data = WeekData(
                week_key=week_key,
                completions=json.dumps(data.completions),
                listed=data.stats.listed,
                sales=data.stats.sales,
                revenue=data.stats.revenue
            )
            db.add(week_data)
        else:
            week_data.completions = json.dumps(data.completions)
            week_data.listed = data.stats.listed
            week_data.sales = data.stats.sales
            week_data.revenue = data.stats.revenue
        
        db.commit()
        return {"status": "success"}
    finally:
        db.close()

@app.get("/api/stats/summary")
async def get_summary():
    """Get overall statistics across all weeks"""
    db = SessionLocal()
    try:
        all_weeks = db.query(WeekData).all()
        
        total_listed = sum(week.listed for week in all_weeks)
        total_sales = sum(week.sales for week in all_weeks)
        total_revenue = sum(week.revenue for week in all_weeks)
        
        return {
            "total_listed": total_listed,
            "total_sales": total_sales,
            "total_revenue": total_revenue,
            "weeks_tracked": len(all_weeks)
        }
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

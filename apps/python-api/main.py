from fastapi import FastAPI
from routers import items
from config.settings import get_settings

settings = get_settings()
app = FastAPI()

# Include routers
app.include_router(items.router, prefix="/items", tags=["items"])

@app.get("/", tags=["health"])
def read_root():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)
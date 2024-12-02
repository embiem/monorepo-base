from pydantic import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    port: int = 5000
    debug: bool = False

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
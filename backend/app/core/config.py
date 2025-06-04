from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    #API Conifg
    API_STR: str = '/api'
    PROJECT_NAME:str = "AI Budget Tracker"

    # Database URLs
    POSTGRESQL_URL: str = Field("", env="POSTGRESQL_URL")
    MONGODB_URL: str = Field("", env="MONGODB_URL")
    # NEO4J_URL: str = Field("", env="NEO4J_URL")
    # NEO4J_USER: str = Field("", env="NEO4J_USER")
    # NEO4J_PASSWORD: str = Field("", env="NEO4J_PASSWORD")

    OPENAI_API_KEY: str = Field("", env="OPENAI_API_KEY")


    class Config:
        env_file = ""
        case_sensitive = True

settings = Settings()
from pydantic import BaseModel


class Result(BaseModel):
    prediction: bool
    confidence: float
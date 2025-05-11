from datetime import datetime
from pydantic import BaseModel


class Result(BaseModel):
    prediction: bool
    confidence: float


class Dataset(BaseModel):
    user_id: int
    nm_id: int
    CreatedDate: datetime
    service: str
    total_ordered: int
    PaymentType: str
    IsPaid: bool
    count_items: int
    unique_items: int
    avg_unique_purchase: float
    is_courier: int
    NmAge: int
    Distance: int
    DaysAfterRegistration: int
    number_of_orders: int
    number_of_ordered_items: int
    mean_number_of_ordered_items: float
    min_number_of_ordered_items: int
    max_number_of_ordered_items: int
    mean_percent_of_ordered_items: float




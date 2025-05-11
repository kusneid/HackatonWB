from fastapi import APIRouter, UploadFile, HTTPException, File

from api.dtos import Dataset
from ml_model.main import csv_train, csv_predict, json_predict

router = APIRouter(prefix="/model", tags=["model"])


@router.get("/test_connect")
async def get_test_connect():
    return "Connected."

@router.post("/csv/train")
async def csv_train_handler(file: UploadFile = File(...)) -> str:
    if not file:
        raise HTTPException(status_code=400, detail="Файл не выбран")
    if file.content_type != "application/octet-stream":
        raise HTTPException(status_code=400, detail="File type is not supported")
    await csv_train(file.file)
    return "Success!"

@router.post("/csv/predict")
async def csv_predict_handler(file: UploadFile):
    if not file:
        raise HTTPException(status_code=400, detail="Файл не выбран")
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="File type is not supported")
    res = await csv_predict(file.file)
    return res

@router.post("/json/predict")
async def json_predict_handler(body: list[Dataset]):
    ans = json_predict(body)
    return ans
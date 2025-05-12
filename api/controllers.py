from fastapi import APIRouter, UploadFile, HTTPException, File

from api.dtos import Dataset, Result
from ml_model.main import csv_train, csv_predict, json_predict

router = APIRouter(prefix="/model", tags=["model"])


@router.get("/test_connect", summary="Эндпоинт для проверки соединения")
async def get_test_connect() -> str:
    return "Connected."

@router.patch("/update_model", summary="Эндпоинт для изменения модели без перезагрузки приложения")
async def csv_update_handler(file: UploadFile = File(...)) -> str:
    if not file:
        raise HTTPException(status_code=400, detail="Файл не выбран")
    if file.content_type != "application/octet-stream":
        raise HTTPException(status_code=400, detail="File type is not supported")
    return await csv_train(file.file)

@router.post("/csv/predict", summary="Эндпоинт для обработки данных в csv файлах")
async def csv_predict_handler(file: UploadFile) -> list[Result]:
    if not file:
        raise HTTPException(status_code=400, detail="Файл не выбран")
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="File type is not supported")
    res = await csv_predict(file.file)
    return res

@router.post("/json/predict", summary="Эндпоинт для обработки данных в формате json")
async def json_predict_handler(body: list[Dataset]) -> list[Result]:
    res = await json_predict(body)
    return res

from fastapi import APIRouter, Body, UploadFile, HTTPException, File

from ml_model.main import csv_train, csv_predict, json_train, json_predict

router = APIRouter(prefix="/model", tags=["model"])


@router.get("/test_connect")
async def get_test_connect():
    return "Connected."

@router.post("/csv/train")
async def csv_train_handler(file: UploadFile = File(...)):
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="File type is not supported")
    ans = await csv_train(file.file)
    return ans

@router.post("/csv/analyze")
async def csv_analyze_handler(file: UploadFile):
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="File type is not supported")
    ans = await csv_predict(file.file)
    return ans


@router.post("/json/train")
async def json_train_handler(body = Body()):
    ans = json_train(body)
    return ans

@router.post("/json/analyze")
async def json_analyze_handler(body = Body()):
    ans = json_predict(body)
    return ans
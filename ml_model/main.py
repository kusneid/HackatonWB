import os

import pandas as pd

from api.dtos import Result, Dataset
from ml_model.model import predict


async def csv_train(file):
    res = "Fail"
    with open(os.path.join("ml_model","resources","lgbm_model_with_threshold.pkl")) as f:
        content = file.read()  # Чтение содержимого
        f.write(content)
        res = "Success!!!!"
    return res

async def csv_predict(file):
    file.seek(0)
    data = pd.read_csv(file)
    res = await predict(data)
    file.close()
    return [Result(prediction=p, confidence=c) for p, c in res]


async def json_predict(body: list[Dataset]):
    dct = {k: [getattr(el, k) for el in body] for k in Dataset.model_fields.keys()}
    data = pd.DataFrame.from_dict(dct)
    print(data.info())
    res = await predict(data)
    return [Result(prediction=p, confidence=c) for p, c in res]
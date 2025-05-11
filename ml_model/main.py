import pandas as pd

from api.dtos import Result, Dataset
from ml_model.model import predict


async def csv_train(file):
    with open(r"ml_model\resources\lgbm_model_with_threshold.pkl", "wb") as f:
        content = file.read()  # Чтение содержимого
        f.write(content)
    return 1

async def csv_predict(file):
    file.seek(0)
    data = pd.read_csv(file)
    print(data.info())
    res = predict(data)
    file.close()
    return [Result(prediction=p, confidence=c) for p, c in res]


def json_predict(body: list[Dataset]):
    dct = {k: [getattr(el, k) for el in body] for k in Dataset.model_fields.keys()}
    data = pd.DataFrame.from_dict(dct)
    print(data.info())
    res = predict(data)
    return res
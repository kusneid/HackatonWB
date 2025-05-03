import pandas as pd

async def csv_train(file):
    file.seek(0)
    data = pd.read_csv(file)
    print(data.info())
    file.close()
    return 0

def csv_predict(file):
    file.seek(0)
    data = pd.read_csv(file)
    print(data.info())
    file.close()
    return 0

def json_train(file):
    for k, v in file.items():
        print(k, v)
    return file


def json_predict(file):
    for k, v in file.items():
        print(k, v)
    return file
import os

import pandas as pd
import numpy as np
from scipy.spatial.distance import mahalanobis
from scipy import linalg
from sklearn.preprocessing import StandardScaler
import joblib

async def predict(data):
    df_predict = data
    df_train = pd.read_csv(os.path.join("ml_model","resources","df_train.csv"))

    numeric = [
        'total_ordered', 'count_items', 'unique_items', 'Distance',
        'DaysAfterRegistration', 'number_of_orders',
        'number_of_ordered_items', 'mean_number_of_ordered_items',
        'min_number_of_ordered_items', 'max_number_of_ordered_items'
    ]

    # Удаляем аномалии из train
    X_num = df_train[numeric].values
    Xs = StandardScaler().fit_transform(X_num)
    cov_inv = linalg.inv(np.cov(Xs, rowvar=False))
    mean = Xs.mean(axis=0)
    md = np.array([mahalanobis(x, mean, cov_inv) for x in Xs])
    thr = np.percentile(md, 98.6)
    mask = md <= thr

    df_train = df_train.loc[mask].reset_index(drop=True)


    for df in (df_train, df_predict):
        for col in numeric:
            df[col] = np.log1p(df[col])

    # Приводим CreateDate к datetime, а IsPaid и is_courier к int
    for df in (df_train, df_predict):
        df['CreatedDate'] = pd.to_datetime(df['CreatedDate'], utc=True)
        df['IsPaid'] = df['IsPaid'].astype(int)
        df['is_courier'] = df['is_courier'].astype(int)

    # Преобразуем CreateDate в часы дни недели
    for df in (df_train, df_predict):
        df['hour'] = df['CreatedDate'].dt.hour


    df_train['temp'] = 0
    df_predict['temp'] = 1
    full = pd.concat([df_train, df_predict], axis=0)
    # Делаем для service и PaymentType One Hot encoding
    full = pd.get_dummies(full, columns=['service', 'PaymentType', 'hour'], drop_first=False)
    df_train = full[full['temp'] == 0].drop(columns='temp')
    df_predict = full[full['temp'] == 1].drop(columns='temp')


    features = [c for c in df_train.columns if c not in ['target', 'user_id',
                                                         'nm_id', 'CreatedDate']]
    scaler = StandardScaler()
    df_train[features] = scaler.fit_transform(df_train[features])
    df_predict[features] = scaler.transform(df_predict[features])


    avg_cols = [col for col in df_train.columns if col not in ['target']]
    for df in (df_train, df_predict):
        df[avg_cols] = df.groupby('user_id')[avg_cols].transform('mean')
    # Удаляем лишние столбцы
    for df in (df_train, df_predict):
        df.drop(columns=['user_id', 'nm_id', 'CreatedDate'], inplace=True)

    data = joblib.load(os.path.join("ml_model","resources","lgbm_model_with_threshold.pkl"))
    best_model = data['model']
    best_threshold = data['threshold']

    x_pred = df_predict.drop(columns='target')

    probs = best_model.predict_proba(x_pred)[:, 1]
    y_pred = (probs >= best_threshold).astype(int)

    new_probs = []
    for i in range(len(probs)):
        if y_pred[i] == 1:
            new_probs.append(probs[i])
        else:
            new_probs.append(1 - probs[i])

    return zip(y_pred, new_probs)
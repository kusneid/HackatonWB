# 🚀 Хакатон Wildberries

## 📊 Модель
### **Описание**  
Прогнозная модель для анализа данных о заказах и пользовательской активности. Обрабатывает исторические данные для выявления паттернов и генерации предсказаний.

### **Стек технологий**
```
- Pandas  # Анализ и обработка данных
- Scikit-learn  # Машинное обучение
- NumPy  # Вычисления
- Matplotlib/Seaborn  # Визуализация
```

### Обзор данных и подход
- **Датасет**  
  - Исходные данные: df_train.csv
  - Количество записей: 105566  
  - Количество признаков: 18  
- **Предобработка**  
  - Пропуски: отсутствуют
  - Применялось масштабирование признаков
    ```python
     scaler = StandardScaler()
     df_train[features] = scaler.fit_transform(df_train[features])
     df_test[features]  = scaler.transform(df_test[features])
     ```
  - Балансировка:  
    - SMOTE (`SMOTE(random_state=42)`)  
    - `class_weight='balanced'` в LightGBM  
- **Архитектура модели**  
  - Алгоритм: LightGBM (градиентный бустинг на решающих деревах)  
  - Использован ансамблевый подход с подбором гиперпараметров через grid search по комбинациям параметров и выбором порога классификации по максимальному F1-score на валидации  

### Ключевые гиперпараметры
```python
best_params: {'n_estimators': 392, 'num_leaves': 63, 'max_depth': 10, 'learning_rate': 0.05, 'min_child_samples': 5, 'min_gain_to_split': 0.0, 'class_weight': 'balanced', 'random_state': 42, 'verbose': -1}
```

### Результаты на тесте

- **Порог классификации (Threshold):** 0.919  
- **Precision (миноритарный класс):** 0.879  
- **Recall (миноритарный класс):** 0.125  

#### Confusion Matrix
|               | Predicted 0 | Predicted 1 |
|---------------|-------------|-------------|
| **Actual 0**  |      12424  |      31     |
| **Actual 1**  |      1580   |     226     |

#### Classification Report
| Класс | Precision | Recall | F1-score | Support |
|-------|-----------|--------|----------|---------|
| 0     | 0.887     | 0.998  | 0.939    | 12455   |
| 1     | 0.879     | 0.125  | 0.219    | 1806    |
| **accuracy**    |           |        | **0.887**  | 14261   |
| **macro avg**   | 0.883     | 0.561  | 0.579    | 14261   |
| **weighted avg**| 0.886     | 0.887  | 0.848    | 14261   |

- **PR-AUC:** 0.367  
- **ROC-AUC:** 0.632  



## 🖥️ Бэкенд
### **Описание**  
REST API для интеграции модели с фронтендом. Обеспечивает прием запросов, валидацию данных, взаимодействие с моделью и возврат результатов.

### **Стек технологий**  
```
- FastAPI  # Веб-фреймворк
- Uvicorn  # ASGI-сервер
- Pydantic  # Валидация данных
```

### **[🚀 Основные эндпоинты](http://localhost:8000/docs)**

### 1. Проверка соединения
**`GET /model/test_connect`**  
Проверка доступности сервиса

```http
GET /model/test_connect HTTP/1.1
Host: localhost:8000
```
#### Успешный ответ:

```json
{
  "status": "success",
  "message": "Service is available",
  "timestamp": "2023-08-20T12:34:56Z"
}
```
### 2. Обновление модели
**`PATCH /model/update_model`**

Обновление ML-модели во время работы сервиса

#### Параметры:

#### ** file (binary): Файл новой модели формат pkl (обязательный) **

```http
PATCH /model/update_model HTTP/1.1
Content-Type: multipart/form-data
```
#### Пример запроса:

```bash
curl -X PATCH -F "file=@new_model.pkl" http://localhost:8000/model/update_model
```
### 3. Прогнозирование из CSV
**`POST /model/csv/predict`**

Пакетная обработка CSV-файлов

#### Требования к файлу:
- Кодировка: UTF-8
- Формат: CSV с заголовками
- Поддерживаемые поля: см. Схему данных

```http
POST /model/csv/predict HTTP/1.1
Content-Type: multipart/form-data
```
Пример ответа:

```json
[
  {
    "prediction": true,
    "confidence": 0.95
  },
  {
    "prediction": false,
    "confidence": 0.23
  }
]
```
### 4. Прогнозирование из JSON
**`POST /model/json/predict`**

Обработка структурированных данных

#### Формат запроса:

```json
[
  {
    "user_id": 12345,
    "nm_id": 67890,
    "CreatedDate": "2023-08-20T12:00:00",
    ...
  }
]
```
#### Пример запроса:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d @request.json \
  http://localhost:8000/model/json/predict
```
### **🔍 Структура данных**
### Модель Dataset
```json
{
  "user_id": "int (required)",
  "nm_id": "int (required)",
  "CreatedDate": "datetime (required)",
  "service": "string (required)",
  "total_ordered": "int (required)",
  "PaymentType": "string (required)",
  "IsPaid": "boolean (required)",
  "count_items": "int (required)",
  "unique_items": "int (required)",
  "avg_unique_purchase": "float (required)",
  "is_courier": "int (required)",
  "NmAge": "int (required)",
  "Distance": "int (required)",
  "DaysAfterRegistration": "int (required)",
  "number_of_orders": "int (required)",
  "number_of_ordered_items": "int (required)",
  "mean_number_of_ordered_items": "float (required)",
  "min_number_of_ordered_items": "int (required)",
  "max_number_of_ordered_items": "int (required)",
  "mean_percent_of_ordered_items": "float (required)"
}
```
### Модель Result
```json
{
  "prediction": "boolean (required)",
  "confidence": "float (required)"
}
```
### ⚠️ Ошибки
#### Коды
- 200	OK	Успешный запрос
- 400	Bad Request	Ошибка валидации данных
- 422	Unprocessable Entity	Семантические ошибки
- 500	Internal Error	Ошибка сервера
#### Пример ошибки:

```json
{
  "detail": [
    {
      "loc": ["body", "user_id"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## 🌐 Фронтенд
### **Описание**
Описание
Интерактивный интерфейс для визуализации прогнозов модели. Отображает графики, таблицы и позволяет настраивать параметры запросов.

### **Стек технологий**  
```
- ReactJS  # Библиотека для UI
- Axios  # HTTP-запросы к бэкенду
```


## Запуск
Запуск осуществляется средствами инструмента **Docker Compose**.

### **[Исходный код для сборки](https://github.com/kusneid/HackatonWB/tree/api)**

### Для создания и запуска контейнера **Docker** выполнить:
```shell
docker-compose build --no-cache && docker-compose up -d
```

### По окончанию выполнения будет доступен **[Веб-интерфейс](http://localhost:3000)**

### Требования к эксплуатации
Для запуска сборки требуется чтобы порты 8000 и 3000 были свободны.

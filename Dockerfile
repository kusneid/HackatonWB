FROM python:3.12.7

WORKDIR /app

COPY api ./api/
COPY ml_model ./ml_model/
COPY requirements.txt main.py ./

RUN pip install -r requirements.txt

CMD ["python", "main.py"]
import uvicorn
from fastapi import FastAPI

from api.presets import setup_app

app = FastAPI(title="HackatonWB", description="HackatonWB API")
setup_app(app)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)

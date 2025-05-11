from starlette.middleware.cors import CORSMiddleware

from api.controllers import router

def setup_app(app):
    app.include_router(router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
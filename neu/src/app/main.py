from fastapi import FastAPI
from routers import recipes, auth, users
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(auth.router)
app.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.mount("/media", StaticFiles(directory="media"), name="media")
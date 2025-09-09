import motor.motor_asyncio
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://root:example@mongodb:27017/")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)

db = client["foodify"]
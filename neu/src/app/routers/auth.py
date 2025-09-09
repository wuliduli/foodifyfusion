from fastapi import APIRouter, HTTPException, Form
from models.user import UserIn, UserOut
from services.auth import hash_password, verify_password, create_token
from database.mongodb import db

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user: UserIn):
    """
    Registriere einen neuen User.

    Übergabeparameter:
    - user (UserIn, Pflichtfeld): User-Objekt mit email und password

    Rückgabe:
    - UserOut: User-Objekt mit email

    Fehler:
    - HTTP 400, wenn die Email bereits registriert ist
    """
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    await db["users"].insert_one({"email": user.email, "password": hashed})
    return {"email": user.email}

@router.post("/login")
async def login(user: UserIn):
    """
    Logge einen User ein und gebe ein Access-Token zurück.

    Übergabeparameter:
    - user (UserIn, Pflichtfeld): User-Objekt mit email und password

    Rückgabe:
    - access_token (str): JWT-Token für Authentifizierung

    Fehler:
    - HTTP 401 bei ungültigen Zugangsdaten
    """
    db_user = await db["users"].find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token(user.email)}

@router.post("/token")
async def login_token(
    username: str = Form(...),
    password: str = Form(...)
):
    """
    OAuth2-kompatibler Login-Endpunkt für FastAPI.

    Übergabeparameter:
    - username (str, Pflichtfeld): Email-Adresse
    - password (str, Pflichtfeld): Passwort

    Rückgabe:
    - access_token (str): JWT-Token für Authentifizierung
    - token_type (str): "bearer"

    Fehler:
    - HTTP 401 bei ungültigen Zugangsdaten
    """
    db_user = await db["users"].find_one({"email": username})
    if not db_user or not verify_password(password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "access_token": create_token(username),
        "token_type": "bearer"
    }

@router.post("/change-password")
async def change_password(
    email: str = Form(...),
    old_password: str = Form(...),
    new_password: str = Form(...)
):
    """
    Ändere das Passwort eines Users.

    Übergabeparameter:
    - email (str, Pflichtfeld): Email-Adresse des Users
    - old_password (str, Pflichtfeld): Aktuelles Passwort
    - new_password (str, Pflichtfeld): Neues Passwort

    Rückgabe:
    - msg (str): Statusnachricht ("Password updated successfully")

    Fehler:
    - HTTP 401 bei ungültigen Zugangsdaten
    """
    db_user = await db["users"].find_one({"email": email})
    if not db_user or not verify_password(old_password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    new_hashed = hash_password(new_password)
    await db["users"].update_one(
        {"email": email},
        {"$set": {"password": new_hashed}}
    )
    return {"msg": "Password updated successfully"}

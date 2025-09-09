from fastapi import APIRouter, Depends, HTTPException, Request, Body
from database.mongodb import db
from bson import ObjectId
from typing import List, Optional
from uuid import UUID

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi import status
from services.auth import SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from models.user import CustomFilterAddRequest


import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("recipes")



router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Hole den aktuell authentifizierten User anhand des Bearer-Tokens.

    Übergabeparameter:
    - token (str, Pflichtfeld): Bearer-Token im Authorization-Header

    Rückgabe:
    - User-Dokument aus der Datenbank (dict)

    Fehler:
    - HTTP 401, wenn das Token ungültig ist oder kein User gefunden wird
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await db["users"].find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

async def get_current_user_optional(request: Request):
    """
    Hole optional den aktuell authentifizierten User anhand des Bearer-Tokens im Header.

    Übergabeparameter:
    - request (Request, Pflichtfeld): FastAPI Request-Objekt

    Rückgabe:
    - User-Dokument aus der Datenbank (dict), falls Token vorhanden und gültig
    - None, falls kein oder ungültiges Token
    """
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return None
    token = auth_header[7:]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None
    user = await db["users"].find_one({"email": email})
    return user

@router.put("/favorite")
async def add_favorite(recipe_id: str, user=Depends(get_current_user)):
    """
    Füge ein Rezept zu den Favoriten des Users hinzu. (Authentifizierung erforderlich)

    Übergabeparameter:
    - recipe_id (str, Pflichtfeld): Die ID des Rezepts
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - message (str): Statusnachricht ("Recipe added to favorites")

    Fehler:
    - HTTP 400 bei ungültiger ID
    """
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$addToSet": {"favorites": recipe_id}}
    )
    return {"message": "Recipe added to favorites"}

@router.delete("/favorite")
async def remove_favorite(recipe_id: str, user=Depends(get_current_user)):
    """
    Entferne ein Rezept aus den Favoriten des Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - recipe_id (str, Pflichtfeld): Die ID des Rezepts
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - message (str): Statusnachricht ("Recipe removed from favorites")

    Fehler:
    - HTTP 400 bei ungültiger ID
    """
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$pull": {"favorites": recipe_id}}
    )
    return {"message": "Recipe removed from favorites"}

@router.get("/favorites", response_model=List[str])
async def get_favorites(user=Depends(get_current_user)):
    """
    Hole die Liste der Favoriten des Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - Liste von Rezept-IDs (List[str])
    """
    return user.get("favorites", [])

@router.get("/userdata")
async def get_userdata(user=Depends(get_current_user)):
    """
    Hole die Nutzerdaten des aktuell eingeloggten Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - user_data (dict): Userdaten ohne Passwort, inkl. _id (str), created_recipes (List[str]), favorites (List[str])
    """
    user_data = dict(user)
    user_data.pop("password", None)  # Entferne das Passwort, falls vorhanden
    user_data["_id"] = str(user_data["_id"])  # ObjectId zu String
    # created_recipes als Liste von Strings
    if "created_recipes" in user_data:
        user_data["created_recipes"] = [str(rid) for rid in user_data["created_recipes"]]
    else:
        user_data["created_recipes"] = []
    return user_data

@router.get("/custom_filters")
async def get_custom_filters(user=Depends(get_current_user)):
    """
    Hole die benutzerdefinierten Filter des Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - custom_filters (dict): Dictionary mit Filternamen als Schlüssel und Listen von Zutaten als Wert, z.B. {"nicht_moegen": ["Rosinen", "Kapern"]}
    """
    logger.info(f"Fetching custom filters for user: {user['_id']}")
    return user.get("custom_filters", {})

@router.put("/custom_filters")
async def set_custom_filters(custom_filters: dict, user=Depends(get_current_user)):
    """
    Setze die benutzerdefinierten Filter des Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - custom_filters (dict, Pflichtfeld, Body): Dictionary mit Filternamen als Schlüssel und Listen von Zutaten als Wert
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - message (str): Statusnachricht ("Custom filters updated")
    """
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"custom_filters": custom_filters}}
    )
    return {"message": "Custom filters updated"}

@router.get("/active_custom_filters")
async def get_active_custom_filters(user=Depends(get_current_user)):
    """
    Hole die aktuell aktivierten benutzerdefinierten Filter des Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - active_custom_filters (List[str]): Liste der aktiven Filternamen
    """
    return user.get("active_custom_filters", [])

@router.put("/active_custom_filters")
async def set_active_custom_filters(
    active_custom_filters: List[str] = Body(..., description="Liste der aktiven Filter"),
    user=Depends(get_current_user)
):
    """
    Setze die aktuell aktivierten benutzerdefinierten Filter des Users. (Authentifizierung erforderlich)

    Übergabeparameter:
    - active_custom_filters (List[str], Pflichtfeld, Body): Liste der aktiven Filternamen
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - message (str): Statusnachricht ("Active custom filters updated")
    """
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"active_custom_filters": active_custom_filters}}
    )
    return {"message": "Active custom filters updated"}

@router.post("/custom_filters/add")
async def add_custom_filter(
    data: CustomFilterAddRequest,
    user=Depends(get_current_user)
):
    """
    Füge einen benutzerdefinierten Filter zum Nutzerprofil hinzu oder überschreibe ihn. (Authentifizierung erforderlich)

    Übergabeparameter:
    - data (CustomFilterAddRequest, Pflichtfeld, Body): Objekt mit name (str, Filtername) und values (List[str], Zutaten)
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Rückgabe:
    - message (str): Statusnachricht ("Custom filter '<name>' gespeichert.")
    - custom_filters (dict): Aktueller Stand der benutzerdefinierten Filter nach dem Hinzufügen
    """
    custom_filters = user.get("custom_filters", {})
    custom_filters[data.name] = data.values
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"custom_filters": custom_filters}}
    )
    return {"message": f"Custom filter '{data.name}' gespeichert.", "custom_filters": custom_filters}
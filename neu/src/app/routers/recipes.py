from fastapi import APIRouter, UploadFile, File, Form, Query, Depends
from typing import Optional, List
from models.recipe import Recipe, Filter, RecipeSearchResponse
from database.mongodb import db
from uuid import uuid4
import os
from bson import ObjectId 
from search.meilisearch_client import add_or_update_recipe, delete_recipe as ms_delete_recipe, search_recipes as ms_search_recipes
from routers.users import get_current_user, get_current_user_optional
import logging

router = APIRouter()

MEDIA_DIR = "media"
os.makedirs(MEDIA_DIR, exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("recipes")

@router.post("/create", response_model=Recipe)
async def create_recipe(
    title: str = Form(...),
    description: str = Form(...),
    ingredients: str = Form(..., description='Zutaten als JSON-String: {"zutat": "Anzahl/Gewicht als String"}'),
    cook_bake_time: int = Form(...),
    servings: int = Form(None),
    images: Optional[List[UploadFile]] = File(None, description="Optional: Bilder zum Rezept"),
    filter: Optional[List[Filter]] = None,
    is_public: bool = Form(True),
    user=Depends(get_current_user)
):
    """
    Erstelle ein neues Rezept. (Authentifizierung erforderlich)

    Übergabeparameter:
    - title (str, Pflichtfeld, Form): Titel des Rezepts
    - description (str, Pflichtfeld, Form): Beschreibung des Rezepts
    - ingredients (str, Pflichtfeld, Form): Zutaten als JSON-String, z.B. {"Mehl": "200g", "Milch": "100ml"}
    - cook_bake_time (int, Pflichtfeld, Form): Koch- oder Backzeit in Minuten
    - servings (int, optional, Form): Anzahl der Portionen
    - images (List[UploadFile], optional, File): Bilder zum Rezept (Dateiupload)
    - filter (List[Filter], optional): Filter (Mehrfachauswahl möglich)
    - is_public (bool, optional, Form, default=True): Gibt an, ob das Rezept öffentlich ist
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Hinweise:
    - Die Zutaten müssen als JSON-String übergeben werden.
    - Bilder werden im media/-Verzeichnis gespeichert.
    - Das Rezept wird dem User als "erstellt" zugeordnet.

    Rückgabe:
    - Das erstellte Rezept als JSON-Objekt mit allen Feldern inkl. id, image_urls, ratings, average_rating etc.

    Fehler:
    - Bei Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        import json
        image_urls = []
        if images:
            for image in images:
                filename = f"{uuid4().hex}_{image.filename}"
                filepath = os.path.join(MEDIA_DIR, filename)
                with open(filepath, "wb") as f:
                    content = await image.read()
                    f.write(content)
                image_urls.append(f"/media/{filename}")
        # Zutaten als Dict parsen
        ingredients_dict = json.loads(ingredients)
        # Extrahiere Zutaten-Namen für Meilisearch
        ingredient_names = list(ingredients_dict.keys())
        recipe = {
            "title": title,
            "description": description,
            "ingredients": ingredients_dict,
            "ingredient_names": ingredient_names,
            "cook_bake_time": cook_bake_time,
            "servings": servings,
            "image_urls": image_urls,
            "filter": filter,
            "owner_id": str(user["_id"]),
            "is_public": is_public
        }
        # Bewertungen initialisieren
        recipe["ratings"] = {}
        recipe["average_rating"] = None
        result = await db["recipes"].insert_one(recipe)
        recipe["id"] = str(result.inserted_id)
        recipe.pop("_id", None)
        add_or_update_recipe(recipe)
        # Update user: add recipe to created_recipes
        await db["users"].update_one(
            {"_id": user["_id"]},
            {"$addToSet": {"created_recipes": recipe["id"]}}
        )
        return recipe
    except Exception as e:
        print("Fehler beim Erstellen des Rezepts:", e)
        raise


@router.delete("/delete")
async def delete_recipe(id: str, user=Depends(get_current_user)):
    """
    Lösche ein Rezept. (Authentifizierung erforderlich)

    Übergabeparameter:
    - id (str, Pflichtfeld, Query): Die ID des zu löschenden Rezepts
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Hinweise:
    - Nur der Besitzer (Ersteller) eines Rezepts kann dieses löschen.
    - Zugehörige Bilder werden entfernt.
    - Die Rezept-ID wird aus der User-Liste entfernt.

    Rückgabe:
    - message (str): Statusnachricht ("Recipe deleted successfully", "Not authorized to delete this recipe", "Recipe not found")

    Fehler:
    - Gibt {"message": "Recipe not found"} zurück, falls das Rezept nicht existiert.
    - Gibt {"message": "Not authorized to delete this recipe"} zurück, falls der User nicht berechtigt ist.
    - Bei anderen Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        recipe = await db["recipes"].find_one({"_id": ObjectId(id)})
        if not recipe:
            return {"message": "Recipe not found"}
        # Nur Besitzer darf löschen
        if str(recipe.get("owner_id")) != str(user["_id"]):
            return {"message": "Not authorized to delete this recipe"}
        # Bilder löschen
        if recipe.get("image_urls"):
            image_paths = recipe["image_urls"]
            for image_path in image_paths:
                image_path = image_path.lstrip("/")
                if os.path.exists(image_path):
                    os.remove(image_path)
        result = await db["recipes"].delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            ms_delete_recipe(id)
            # Entferne Rezept-ID aus created_recipes des Users
            await db["users"].update_one(
                {"_id": user["_id"]},
                {"$pull": {"created_recipes": id}}
            )
            return {"message": "Recipe deleted successfully"}
        else:
            return {"message": "Recipe not found"}
    except Exception as e:
        print("Fehler beim Löschen des Rezepts:", e)
        raise

@router.get("/get_recipe")
async def get_recipe(id: str, user=Depends(get_current_user_optional)):
    """
    Hole ein einzelnes Rezept anhand der ID.

    Übergabeparameter:
    - id (str, Pflichtfeld, Query): Die ID des Rezepts
    - Authentifizierung: Optional (Bearer-Token im Authorization-Header)

    Hinweise:
    - Private Rezepte können nur vom Besitzer abgerufen werden (Authentifizierung erforderlich).
    - Bei Authentifizierung wird zusätzlich das Feld isFavorite (bool) zurückgegeben.

    Rückgabe:
    - Das Rezept-Objekt mit allen Feldern und zusätzlich isFavorite (bool)
    - Bei Fehlern: {"message": "..."} (z.B. "Recipe not found", "Not authorized to view this recipe")

    Fehler:
    - Gibt {"message": "Recipe not found"} zurück, falls das Rezept nicht existiert.
    - Gibt {"message": "Not authorized to view this recipe"} zurück, falls der User nicht berechtigt ist.
    - Bei anderen Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        recipe = await db["recipes"].find_one({"_id": ObjectId(id)})
        if recipe:
            # Privat? Nur Besitzer darf sehen
            if not recipe.get("is_public", True):
                if not user or str(recipe.get("owner_id")) != str(user["_id"]):
                    return {"message": "Not authorized to view this recipe"}
            recipe["id"] = str(recipe["_id"])
            recipe.pop("_id", None)
            is_favorite = False
            if user and "favorites" in user:
                is_favorite = recipe["id"] in user["favorites"]
            recipe["isFavorite"] = is_favorite
            # Durchschnitt nachtragen, falls nicht vorhanden
            if "average_rating" not in recipe:
                ratings = recipe.get("ratings", {})
                recipe["average_rating"] = round(sum(ratings.values()) / len(ratings), 2) if ratings else None
            return recipe
        else:
            return {"message": "Recipe not found"}
    except Exception as e:
        print("Fehler beim Abrufen des Rezepts:", e)
        raise

@router.put("/update", response_model=Recipe)
async def update_recipe(
    id: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    ingredients: str = Form(...),
    cook_bake_time: int = Form(...),
    servings: int = Form(None),
    images: Optional[List[UploadFile]] = File(None, description="Optional: Bilder zum Rezept"),
    filter: Optional[List[Filter]] = None,
    is_public: bool = Form(True),
    user=Depends(get_current_user)
):
    """
    Aktualisiere ein bestehendes Rezept. (Authentifizierung erforderlich)

    Übergabeparameter:
    - id (str, Pflichtfeld, Form): Die ID des zu aktualisierenden Rezepts
    - title (str, Pflichtfeld, Form): Titel des Rezepts
    - description (str, Pflichtfeld, Form): Beschreibung des Rezepts
    - ingredients (str, Pflichtfeld, Form): Zutaten als JSON-String
    - cook_bake_time (int, Pflichtfeld, Form): Koch- oder Backzeit in Minuten
    - servings (int, optional, Form): Anzahl der Portionen
    - images (List[UploadFile], optional, File): Neue Bilder zum Rezept (Dateiupload)
    - filter (List[Filter], optional): Filter (Mehrfachauswahl möglich)
    - is_public (bool, optional, Form, default=True): Gibt an, ob das Rezept öffentlich ist
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Hinweise:
    - Nur der Besitzer kann das Rezept aktualisieren.
    - Neue Bilder ersetzen die alten Bilder (alte werden gelöscht).

    Rückgabe:
    - Das aktualisierte Rezept als JSON-Objekt mit allen Feldern

    Fehler:
    - Gibt {"message": "Recipe not found"} zurück, falls das Rezept nicht existiert.
    - Gibt {"message": "Not authorized to update this recipe"} zurück, falls der User nicht berechtigt ist.
    - Bei anderen Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        import json
        recipe = await db["recipes"].find_one({"_id": ObjectId(id)})
        if not recipe:
            return {"message": "Recipe not found"}
        # Besitzprüfung
        if str(recipe.get("owner_id")) != str(user["_id"]):
            return {"message": "Not authorized to update this recipe"}
        image_urls = recipe.get("image_urls", [])
        # Optional: Bilder aktualisieren
        if images:
            # Neue Bilder speichern
            image_urls = []
            for image in images:
                filename = f"{uuid4().hex}_{image.filename}"
                filepath = os.path.join(MEDIA_DIR, filename)
                with open(filepath, "wb") as f:
                    content = await image.read()
                    f.write(content)
                image_urls.append(f"/media/{filename}")
            # Alte Bilder löschen
            old_image_paths = recipe.get("image_urls", [])
            for old_image_path in old_image_paths:
                old_image_path = old_image_path.lstrip("/")
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
        # Zutaten als Dict parsen
        ingredients_dict = json.loads(ingredients)
        ingredient_names = list(ingredients_dict.keys())
        update_data = {
            "title": title,
            "description": description,
            "ingredients": ingredients_dict,
            "ingredient_names": ingredient_names,
            "cook_bake_time": cook_bake_time,
            "servings": servings,
            "image_urls": image_urls,
            "filter": filter,
            "is_public": is_public
        }
        await db["recipes"].update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        updated_recipe = await db["recipes"].find_one({"_id": ObjectId(id)})
        if updated_recipe:
            updated_recipe["id"] = str(updated_recipe["_id"])
            updated_recipe.pop("_id", None)
            add_or_update_recipe(updated_recipe)
            return updated_recipe
        else:
            return {"message": "Recipe not found"}
    except Exception as e:
        print("Fehler beim Aktualisieren des Rezepts:", e)
        raise

@router.get("/random", response_model=list[Recipe])
async def get_random_recipes(
    skip: int = Query(0, ge=0, description="Wie viele Ergebnisse überspringen (Pagination)"),
    limit: int = Query(10, ge=1, le=50, description="Maximale Anzahl Ergebnisse"),
    user=Depends(get_current_user_optional)
):
    """
    Hole zufällige Rezepte mit Pagination.

    Übergabeparameter:
    - skip (int, optional, Query, default=0): Wie viele Ergebnisse überspringen (Pagination)
    - limit (int, optional, Query, default=10): Maximale Anzahl Ergebnisse (max. 50)
    - Authentifizierung: Optional (Bearer-Token im Authorization-Header)

    Hinweise:
    - Ohne Authentifizierung werden nur öffentliche Rezepte angezeigt.
    - Mit Authentifizierung werden zusätzlich eigene private Rezepte angezeigt.

    Rückgabe:
    - Liste von Rezept-Objekten (JSON)

    Fehler:
    - Bei Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        match_stage = {"is_public": True}
        if user:
            match_stage = {"$or": [
                {"is_public": True},
                {"owner_id": str(user["_id"])}
            ]}
        pipeline = [
            {"$match": match_stage},
            {"$sample": {"size": skip + limit}}
        ]
        recipes_cursor = db["recipes"].aggregate(pipeline)
        recipes = []
        async for recipe in recipes_cursor:
            recipe["id"] = str(recipe["_id"])
            recipe.pop("_id", None)
            # Durchschnitt nachtragen, falls nicht vorhanden
            if "average_rating" not in recipe:
                ratings = recipe.get("ratings", {})
                recipe["average_rating"] = round(sum(ratings.values()) / len(ratings), 2) if ratings else None
            recipes.append(recipe)
        # Pagination: skip und limit anwenden
        return recipes[skip:skip+limit]
    except Exception as e:
        print("Fehler beim Abrufen zufälliger Rezepte:", e)
        raise

@router.get("/search", response_model=RecipeSearchResponse)
async def search_recipes(
    query: str = Query(..., description="Suchbegriff(e)"),
    skip: int = Query(0, ge=0, description="Wie viele Ergebnisse überspringen (Pagination)"),
    limit: int = Query(10, ge=1, le=50, description="Maximale Anzahl Ergebnisse"),
    filters: Optional[List[str]] = Query(None, description="Liste von Filtern (z.B. vegan, glutenfrei, etc.)"),
    custom_filter_names: Optional[List[str]] = Query(None, description="Namen der benutzerdefinierten Filter (z.B. nicht_moegen)"),
    user=Depends(get_current_user_optional)
):
    """
    Suche nach Rezepten mit Fuzzy-Logik (Tippfehler-Toleranz), optionalen Filtern und benutzerdefinierten Zutaten-Blacklist-Filtern.

    Übergabeparameter:
    - query (str, Pflichtfeld, Query): Suchbegriff(e)
    - skip (int, optional, Query, default=0): Wie viele Ergebnisse überspringen (Pagination)
    - limit (int, optional, Query, default=10): Maximale Anzahl Ergebnisse (max. 50)
    - filters (List[str], optional, Query): Liste von Filtern (z.B. vegan, glutenfrei)
    - custom_filter_names (List[str], optional, Query): Namen der benutzerdefinierten Filter (z.B. nicht_moegen)
    - Authentifizierung: Optional (Bearer-Token im Authorization-Header)

    Hinweise:
    - Blacklist-Filter werden auf Zutaten angewendet.
    - Ergebnisse werden paginiert zurückgegeben.

    Rückgabe:
    - results (List[Recipe]): Gefundene Rezepte (paginiert)
    - total (int): Gesamtanzahl der Treffer nach Filterung
    - page (int): Aktuelle Seite
    - pages (int): Gesamtanzahl Seiten

    Fehler:
    - Bei Fehlern wird eine leere Ergebnisliste mit total=0 zurückgegeben.
    """
    logger.info("Starte Rezeptsuche")
    try:
        # Hole viele Treffer, um nachträglich filtern zu können
        fetch_limit = max(1000, (skip + limit) * 2)
        result = ms_search_recipes(query, 0, fetch_limit, filters, user, custom_filter_names)
        hits = result.get("hits", [])
        # logger.info(f"Fetching custom filters for user: {user['_id']}")
        logger.info(f"custom_filter_names: {custom_filter_names}")
        logger.info(f"user_filters: {user.get('custom_filters', {}) if user else None}")
        logger.info(f"hits count: {len(hits)}")
        # Blacklist-Filter im Python-Code
        filtered = []
        total_filtered = 0
        if user:
            logger.info(f"User: {user.get('email', 'Unknown')}")
            user_filters = user.get("custom_filters", {})
            logger.info(f"User-Filter: {user_filters}")
            if not custom_filter_names:
                custom_filter_names = user.get("active_custom_filters", [])
            blacklist_strings = [b.lower() for fname in (custom_filter_names or []) for b in user_filters.get(fname, [])]
            logger.info(f"Blacklist-Strings: {blacklist_strings}")
            if blacklist_strings:
                for recipe in hits:
                    ingredient_names = recipe.get("ingredient_names")
                    logger.info(f"Prüfe Rezept {recipe.get('id')}: ingredient_names={ingredient_names}")
                    if not ingredient_names and "ingredients" in recipe:
                        ingredient_names = list(recipe["ingredients"].keys())
                    ingredient_names = [ing.lower() for ing in (ingredient_names or [])]
                    logger.info(f"Vergleiche Zutaten: {ingredient_names}")
                    if not any(any(b in ing for ing in ingredient_names) for b in blacklist_strings):
                        filtered.append(recipe)
                total_filtered = len(filtered)
                paginated = filtered[skip:skip+limit]
                logger.info(f"Gefilterte Rezepte: {len(filtered)}")
                return {"results": paginated, "total": total_filtered, "page": skip // limit + 1, "pages": (total_filtered + limit - 1) // limit}
        # Wenn keine Blacklist, normale Pagination
        total_filtered = len(hits)
        paginated = hits[skip:skip+limit]
        logger.info(f"Ungefilterte Rezepte: {len(hits)}")
        return {"results": paginated, "total": total_filtered, "page": skip // limit + 1, "pages": (total_filtered + limit - 1) // limit}
    except Exception as e:
        logger.error(f"Fehler bei der Suche: {e}")
        return {"results": [], "total": 0, "page": 1, "pages": 1}

@router.get("/my_recipes", response_model=List[Recipe])
async def get_my_recipes(user=Depends(get_current_user)):
    """
    Hole alle vom eingeloggten User erstellten Rezepte. (Authentifizierung erforderlich)

    Übergabeparameter:
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Hinweise:
    - Gibt alle Rezepte zurück, bei denen der eingeloggte User Besitzer ist.

    Rückgabe:
    - Liste von Rezept-Objekten, die vom User erstellt wurden

    Fehler:
    - Bei Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        recipes_cursor = db["recipes"].find({"owner_id": str(user["_id"])})
        recipes = []
        async for recipe in recipes_cursor:
            recipe["id"] = str(recipe["_id"])
            recipe.pop("_id", None)
            # Durchschnitt nachtragen, falls nicht vorhanden
            if "average_rating" not in recipe:
                ratings = recipe.get("ratings", {})
                recipe["average_rating"] = round(sum(ratings.values()) / len(ratings), 2) if ratings else None
            recipes.append(recipe)
        return recipes
    except Exception as e:
        print("Fehler beim Abrufen eigener Rezepte:", e)
        raise

@router.post("/rate_recipe")
async def rate_recipe(
    recipe_id: str = Form(...),
    rating: int = Form(..., ge=1, le=5),
    user=Depends(get_current_user)
):
    """
    Bewerte ein Rezept mit 1-5 Sternen (nur für eingeloggte User).
    Aktualisiert den Durchschnittswert.

    Übergabeparameter:
    - recipe_id (str, Pflichtfeld, Form): Die ID des zu bewertenden Rezepts
    - rating (int, Pflichtfeld, Form, Wertebereich 1-5): Die Bewertung (Sterne)
    - Authentifizierung: Bearer-Token im Authorization-Header erforderlich

    Hinweise:
    - Jeder eingeloggte User kann jedes Rezept genau einmal bewerten. Eine erneute Bewertung überschreibt die vorherige Bewertung dieses Users.
    - Nach dem Bewerten wird der Durchschnittswert aller Bewertungen aktualisiert.

    Rückgabe:
    - message (str): Statusnachricht ("Rating submitted" oder "Recipe not found")
    - average_rating (float | None): Der neue Durchschnittswert der Bewertungen (auf 2 Nachkommastellen gerundet), None falls keine Bewertung vorhanden

    Fehler:
    - Gibt {"message": "Recipe not found"} zurück, falls das Rezept nicht existiert.
    - Bei anderen Fehlern wird eine Exception ausgelöst und geloggt.
    """
    try:
        recipe = await db["recipes"].find_one({"_id": ObjectId(recipe_id)})
        if not recipe:
            return {"message": "Recipe not found"}
        ratings = recipe.get("ratings", {})
        ratings[str(user["_id"])] = rating
        # Durchschnitt berechnen
        avg = round(sum(ratings.values()) / len(ratings), 2) if ratings else None
        await db["recipes"].update_one(
            {"_id": ObjectId(recipe_id)},
            {"$set": {"ratings": ratings, "average_rating": avg}}
        )
        return {"message": "Rating submitted", "average_rating": avg}
    except Exception as e:
        print("Fehler beim Bewerten:", e)
        raise

from fastapi import UploadFile
from typing import Optional, List, Dict
from pydantic import BaseModel
from enum import Enum

# class Allergy(str, Enum):
#     kuhmilchfrei = "Kuhmilchfrei (Kaseinallergie)"
#     eifrei = "Eifrei (Ovalbuminallergie)"
#     erdnussfrei = "Erdnussfrei (Arachis hypogaea Allergie)"
#     baumnussfrei = "Baumnussfrei"
#     sojafrei = "Sojafrei (Glycine max Allergie)"
#     weizenfrei = "Weizenfrei (Triticum aestivum Allergie)"
#     fischfrei = "Fischfrei (Fischproteinallergie)"
#     krustentierfrei = "Krustentierfrei"
#     sesamfrei = "Sesamfrei (sesamum indicum Allergie)"
#     selleriefrei = "Selleriefrei (apium graveolens Allergie)"
#     senffrei = "Senffrei (Sinapis alba Allergie)"
#     glutenfrei = "Glutenfrei (Glutenunverträglichkeit)"
#     laktosefrei = "Laktosefrei (Laktoseunverträglichkeit)"

class Filter(str, Enum):
    glutenfrei = "glutenfrei"
    laktosefrei = "laktosefrei"
    histaminarm = "histaminarm"
    fruktosearm = "fruktosearm"
    ketogen = "ketogen"
    lowcarb = "low-carb"
    intervallfasten = "intervallfasten"
    paleo = "paleo"
    vegetarisch = "vegetarisch"
    vegan = "vegan"
    halal = "halal"
    koscher = "koscher"
    kuhmilchfrei = "kuhmilchfrei"
    eifrei = "eifrei"
    erdnussfrei = "erdnussfrei"
    baumnussfrei = "baumnussfrei"
    sojafrei = "sojafrei"
    weizenfrei = "weizenfrei"
    fischfrei = "fischfrei"
    krustentierfrei = "krustentierfrei"
    sesamfrei = "sesamfrei"
    selleriefrei = "selleriefrei"
    senffrei = "senffrei"

class Recipe(BaseModel):
    title: str
    description: str
    ingredients: Dict[str, str]  # z.B. {"Rosinen": "50g", "Mehl": "200g"}
    cook_bake_time: int
    servings: int
    image_urls: Optional[List[str]]
    id: str = None
    filter: Optional[List[Filter]] = None
    owner_id: Optional[str] = None
    is_public: Optional[bool] = True
    ratings: Optional[dict[str, int]] = None  # user_id -> rating (1-5)
    average_rating: Optional[float] = None

class RecipeSearchResponse(BaseModel):
    results: List[Recipe]
    total: int
    page: int
    pages: int
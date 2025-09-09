import meilisearch

# client = meilisearch.Client("http://127.0.0.1:7700")
client = meilisearch.Client("http://meilisearch:7700", "Qw3rT9!zXy7pLmN2vB6sDfGhJkL0pOiU8")
index = client.index("recipes")

# Einmalig ausführen (z.B. beim Start)
index.update_searchable_attributes(["title", "ingredients", "description"])
index.update_ranking_rules([
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness"
])
index.update_settings({
    "typoTolerance": {
        "enabled": True,
        "minWordSizeForTypos": {
            "oneTypo": 3,   # ab 3 Buchstaben 1 Fehler erlaubt
            "twoTypos": 5   # ab 5 Buchstaben 2 Fehler erlaubt
        },
        "disableOnAttributes": [],
        "disableOnWords": []
    }
})
# Stelle sicher, dass die Attribute filterbar sind
index.update_filterable_attributes(["is_public", "owner_id", "filter", "ingredient_names"])

def add_or_update_recipe(recipe: dict):
    # Meilisearch erwartet ein Feld "id" als Primärschlüssel
    # ingredient_names muss als Array im Index sein
    if "ingredients" in recipe:
        recipe["ingredient_names"] = list(recipe["ingredients"].keys())
    index.add_documents([recipe])

def delete_recipe(recipe_id: str):
    index.delete_document(recipe_id)

def search_recipes(query: str, skip: int = 0, limit: int = 10, filters: list = None, user: dict = None, custom_filter_names: list = None):
    # Sichtbarkeitsfilter
    visibility_filter = [
        ["is_public", "=", True]
    ]
    if user:
        visibility_filter = [
            ["is_public", "=", True],
            ["owner_id", "=", str(user["_id"])]
        ]
    # Standard-Filter (z.B. vegan, glutenfrei)
    filter_filter = []
    if filters:
        for f in filters:
            filter_filter.append(["filter", "=", f])
    # Kombiniere alle Filter
    all_filters = []
    if user:
        all_filters.append(["or", visibility_filter])
    else:
        all_filters.append(visibility_filter[0])
    all_filters.extend(filter_filter)
    # Meilisearch-Filter-String bauen
    def build_filter_string(filters):
        if not filters:
            return None
        filter_clauses = []
        for f in filters:
            if isinstance(f, list) and f[0] == "or":
                filter_clauses.append("(" + " OR ".join([f'{x[0]} = "{x[2]}"' for x in f[1]]) + ")")
            else:
                filter_clauses.append(f'{f[0]} = "{f[2]}"')
        return " AND ".join(filter_clauses)
    filter_string = build_filter_string(all_filters)
    search_params = {
        "limit": limit,
        "offset": skip,
        "attributesToHighlight": ["title", "ingredients", "description"]
    }
    if filter_string:
        search_params["filter"] = filter_string
    return index.search(query, search_params)
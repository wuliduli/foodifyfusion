from meilisearch import Client

client = Client("http://localhost:7700", "Qw3rT9!zXy7pLmN2vB6sDfGhJkL0pOiU8")  # Passe ggf. URL und Key an
index = client.index("recipes")  # Name deines Indexes

# Alle Dokumente löschen
index.delete_all_documents()
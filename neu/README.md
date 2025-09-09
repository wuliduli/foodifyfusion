# foodify

## Schnellstart (empfohlen mit Docker Compose)

1. Wechsle in das Backend-Verzeichnis:
   ```shell
   cd src/app
   ```
2. Starte Backend und Datenbank gemeinsam:
   ```shell
   docker-compose up --build
   ```
   Das startet automatisch MongoDB und das FastAPI-Backend.

## API-Dokumentation (Swagger UI)

- Nach dem Start erreichst du die interaktive API-Dokumentation unter:
  [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternativ: [http://localhost:8000/redoc](http://localhost:8000/redoc)

Hier kannst du alle Endpunkte testen, inklusive Authentifizierung ("Authorize" oben rechts).


## Hinweise
- Standardmäßig läuft das Backend auf [http://localhost:8000](http://localhost:8000)
- Die API ist OAuth2-geschützt (Token via /auth/token oder /auth/login holen)
- Eigene und private Rezepte, Favoriten etc. sind nur mit Authentifizierung nutzbar
- Siehe Docstrings in den Endpunkten für Details zu Parametern und Rückgaben

## Frontend
- Das Frontend befindet sich im Ordner `Frontend/` (getrennt vom Backend)

---

Für weitere Details siehe Quellcode und API-Dokumentation.
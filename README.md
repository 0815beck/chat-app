# Chat-App

Eine unkomplizierte Chatapp. Sie hat die folgenden Features:

- Websockets um Nachrichten vom Server zur Gesprächspartner*in zu pushen
- Authentifizierung und Authorisation mit Hilfe von JSON-Webtokens

## Run It

Hier ist eine Anleitung um die Chatapp lokal zu testen.

1. Clone das Repository auf deinem Computer.
2. Starte einen MySql-Server auf deinem Computer.
3. Unter /src/sql findest du ein schema.sql file. Führe es auf dem MySql-Server aus. Wenn du das CLI-Interface benutzt zB mit .\ <PROJECT_DIR>/src/sql/schema.sql
4. Starte das Backend indem du "npm run dev" im Backend-Unterordner ausführst.
5. Starte das Frontend über "npm run start" im Frontend-Ordner.
6. Öffne die App in einem Browser.
7. Lege zwei neue Benutzer*innenkonten an.
8. Öffne das MySql CLI, oder MySql-Workbench oder irgendwas anderes, und schau dir die Tabellen in der Datenbank an. Füge manuell einen neuen Chat zur chats-Tabelle hinzu.
9. Füge manuell zwei Einträge zur memberOf-Tabelle hinzu.
10. Logge die beiden Benutzer*innen ein und beginne zu chatten.

Falls du die App online nutzen willst, solltest do den node js server hinter einem richtigem Server wie nginx als reverse Proxy laufen lassen.
User können über die UI-hinzugefügt werden, aber Chatgruppen müssen in dieser Version noch manuell erstellt werden.

Viel Spaß!









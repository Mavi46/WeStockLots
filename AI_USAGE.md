Voor dit project heb ik gekozen voor ChatGPT als sparringpartner voor begeleiding/troubleshooting bij het opzetten van de boilerplate met de vereiste stack (Django, PostgreSQL, Inertia, React en shadcn). Hier heb ik bewust niet gekozen voor Codex, omdat ik graag alles onder controle wil houden en geen agent nodig heb die voor mij een heel project gaat realiseren.

# 1. Boierpalte:
- Bij het configureren van shadcn kreeg ik assetproblemen, waarvoor ik AI heb gebruikt. Hier heb ik de typeset Geist moeten verwijderen en Sans Serif toegevoegd.
- Nadat ik mijn ERD heb gemaakt heb ik AI gevraagd om er overheen te kijken. Chat gaf hierbij een voorstel om 'review_comment' te gebruiken die ik bewust heb afgewezen, omdat dit buiten de scope valt.

# Django project structuur
Dit is mijn eerste project in Django, Inertia en React samen. Ik heb hier AI gebruikt om mij uit te leggen hoe Django apps gestructureerd worden binnen een project en hoe ik mijn ontwerp kan vertalen naar deze stack. Hierbij heeft AI mij begeleid om de inbound app te implementeren door middel van manage.py cli command. Ook heeft AI mij gewezen om de nieuwe inbound app te initialiseren in de INSTALLED_APPS en uitgelegd wat de bestanden doen die automatisch zijn aangemaakt n.a.v. de cli command.

# Modellen en database-migratie
Het datamodel en de relaties tussen de tabellen heb ik vooraf zelf gemodelleerd in een ERD. Omat dit mijn eerste project met Django is, heb ik AI gebruikt om mijn ontwerp te vertalen naar modeldefinities die ik vervolgens heb gecontroleerd en bevestigd. Vervolgens heb ik ook de gegenereerde modellen en relaties gecontroleerd en vergeleken met mijn ERD.

# Seed data
Ik heb AI gebruikt om de vooraf door mij bepaalde seed data om te zetten naar een Django JSON-fixture. AI heeft geholpen met de juiste structuur. Vervolgens heb ik de fixture zelf geladen en gecontroleerd of de gegevens correct in de db waren toegevoegd.


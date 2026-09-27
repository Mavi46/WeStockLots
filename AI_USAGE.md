Voor dit project heb ik gekozen voor ChatGPT als sparringpartner voor begeleiding/troubleshooting bij het opzetten van de boilerplate met de vereiste stack (Django, PostgreSQL, Inertia, React en shadcn). Hier heb ik bewust niet gekozen voor Codex, omdat ik graag alles onder controle wil houden en geen agent nodig heb die voor mij een heel project gaat realiseren.

# 1. Boilerpalte:
- Bij het configureren van shadcn kreeg ik assetproblemen, waarvoor ik AI heb gebruikt. Hier heb ik de typeset Geist moeten verwijderen en Sans Serif toegevoegd.
- Nadat ik mijn ERD heb gemaakt heb ik AI gevraagd om er overheen te kijken. Chat gaf hierbij een voorstel om 'review_comment' te gebruiken die ik bewust heb afgewezen, omdat dit buiten de scope valt.

# Django project structuur
Dit is mijn eerste project in Django, Inertia en React samen. Ik heb hier AI gebruikt om mij uit te leggen hoe Django apps gestructureerd worden binnen een project en hoe ik mijn ontwerp kan vertalen naar deze stack. Hierbij heeft AI mij begeleid om de inbound app te implementeren door middel van manage.py cli command. Ook heeft AI mij gewezen om de nieuwe inbound app te initialiseren in de INSTALLED_APPS en uitgelegd wat de bestanden doen die automatisch zijn aangemaakt n.a.v. de cli command.

# Modellen en database-migratie
Het datamodel en de relaties tussen de tabellen heb ik vooraf zelf gemodelleerd in een ERD. Omat dit mijn eerste project met Django is, heb ik AI gebruikt om mijn ontwerp te vertalen naar modeldefinities die ik vervolgens heb gecontroleerd en bevestigd. Vervolgens heb ik ook de gegenereerde modellen en relaties gecontroleerd en vergeleken met mijn ERD.

# Seed data
Ik heb AI gebruikt om de vooraf door mij bepaalde seed data om te zetten naar een Django JSON-fixture. AI heeft geholpen met de juiste structuur. Vervolgens heb ik de fixture zelf geladen en gecontroleerd of de gegevens correct in de DB waren toegevoegd.

# Supplier delivery workflow
Ik heb AI gebruikt als ondersteuning bij het implementeren van de supplier delivery workflow. Het functionele proces, datamodel, statussen en de regels rondom draft en submitted deliveries had ik vooraf zelf uitgewerkt in mijn plan en ERD. AI heeft geholpen bij het opzetten van de routes en views, het ophalen van PurchaseOrders en Deliveries. Vervolgens heb ik met AI-ondersteuning de functionaliteit geïmplementeerd waarmee een supplier een nieuwe Delivery als draft kan aanmaken, bestaande drafts kan openen en wijzigen en deze tussentijds kan opslaan. Hier hebben we een probleem opgelost hoe Inertia formulieren als JSON verwerkt terwijl Django traditionele form-encoded verzoeken stuurt. Voor het submitten van een Delivery heb ik mijn vooraf bepaalde businessregels met behulp van AI vertaald naar backendvalidatie. Een incomplete draft mag worden opgeslagen, maar bij het submitten worden de verplichte gegevens gecontroleerd. Na succesvolle validatie verandert de status van draft naar submitted. Daarnaast is aan de backend afgedwongen dat een submitted Delivery niet meer door de supplier kan worden gewijzigd. Tijdens de implementatie heb ik de functionaliteit steeds zelf getest in de frontend en gecontroleerd in de DB. Problemen, zoals de verwerking van de JSON request body en de Inertia response bij validatiefouten, zijn tijdens het testen geïdentificeerd en met behulp van AI opgelost.

# Warehouse delivery workflow
Voor de warehouse workflow heb ik AI gebruikt om mijn vooraf bepaalde statusflow technisch te vertalen naar de stack. Eerst is een warehouse-overzicht opgezet, waarin alleen deliveries met de status submitted worden getoond. Vanuit dit overzicht kan een warehouse medewerker een delivery openen en de door de supplier aangeleverde gegevens bekijken. Vervolgens heb ik eerst met ondersteuning van AI de overgang van submitted naar scheduled gebouwd. Hierna heb ik met AI de changes_requested workflow toegevoegd. Hierbij kan een warehouse medewerker wijziging(en) aanvragen met behulp van de warehouse_comment veld. Dit komt dan weer terecht bij de supplier en wordt het bericht getoond.

De rejected workflow heb ik zelf gebouwd op basis van de bestaande structuur die wel eerder door AI is opgezet. 

# Receipt en discrepancies
Voor het verwerken van de ontvangsten heb ik AI gebruikt om de laatste stap van mijn vooraf ontworpen delivery workflow te implementeren. Er is nu onderscheid op de warehouse weergave tussen de submitted en scheduled deliveries. Op de receipt pagina kan de warehouse medewerker nul of meerdere discrepancies registreren, voordat de ontvangst wordt bevestigd. AI stelde daarnaast voor om het opslaan van de receipt en discrepancies binnen een database transaction uit te voeren. Ik heb dit afgewezen, omdat het buiten de scope valt. Tot slot heb ik met AI de supplier pagina uitgebreid, zodat een supplier ook de eventuele discrepancies kan zien. 

# Testing
Voor het testen heb ik AI gebruikt om de belangrijkste businessregels en statusovergasngen te vertalen naar testcases. Tijdens het testen kwam een timezone warning voor het scheduled_at veld die ik met AI heb opgelost. 11/11 tests succesvol uitgevoerd.
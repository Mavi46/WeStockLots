Initieel plan en aannames:

# Scope:
De applicatie omvat de kern van het proces voor inkomende levering:
- Een leverancier dient logistieke informatie in voor een inkooporder.
- Een magazijnmedewerker beoordeelt de inzending en plant de levering in.
- Een magazijnmedewerker registreert de ontvangst en eventuele afwijkingen.
- De leverancier kan de huidige status van de levering en gemelde afwijkingen bekijken.

# Datamodel:
Het initiële domein bestaat uit:
- Supplier
- PurchaseOrder
- Delivery
- Warehouse
- Discrepancy

Bijgevoegd de ERD in de documentatie map. 

Een purchaseOrder behoort tot één Supplier en kan meerdere Deliveries hebben. Elke Delivery vertegenwoordigt één vrachtwagen. Een delivery kan worden ingepland bij één Warehouse. Een Delivery kan meerdere Discrepancies hebben. 

# Leveringsproces:

Een levering binnen het standaardproces heeft de volgende statussen: draft -> submitted -> scheduled -> received

In bijzondere gevallen: submitted -> changes_requested -> submitted of submitted -> rejected

Een discrepancy is bewust niet meegenomen in de status, omdat een levering ontvangen kan zijn, waarbij 0 of meerdere afwijkingen kunnen zijn.

# Aannames:
- Suppliers, purchase orders en warehouses bestaan al in het systeem.
- Authenticatie en autorisatie vallen buiten de scope.
- Voor suppliers, purchase orders en warehouses wordt seed data gebruikt.
- ERD:
    - requested_delivery_date is de door de leverancier gewenste leverdatum.
    - scheduled_at is de definitieve datum en tijd waarop het warehouse de levering ontvangt.
    - Functionaliteit dat de de verzender en ontvanger via de applicatie tot een overeengekomen datum en tijdstip komen valt buiten de scope.
- De leverancies moet standaard aangeven hoeveel pallets OF hoeveel pakketten er zijn, zodra de order wordt doorgestuurd naar warehouse (dus draft -> submitted).
- Warehouse en geplande datum en tijdstip zijn pas verplicht, zodra een levering wordt ingepland (dus submitted -> scheduled).
- Discrepancies worden tijdens of na de ontvangst geregistreerd.


# Implementatievolgorde
1. Modellen en migratie met db
2. Seed data
3. Indienen van een levering door de supplier
4. Beoordeling en planning door het warehouse
5. Ontvangst en discrepancies
6. Testing


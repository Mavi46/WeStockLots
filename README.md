# Supplier Inbound Delivery Portal
A small vertical slice of a supplier inbound delivery portal built as part of the WeStocklots developer assignment.
The application allows suppliers to provide logistics information for purchase orders and enables warehouse employees to review, schedule and receive deliveries.

## Tech stack
- Python / Django
- PostgreSQL
- React / TypeScript
- Inertia.js
- Vite
- Tailwind CSS
- shadcn/ui

## Functionality
### Supplier
A supplier can:
- View purchase orders and deliveries
- Create and save a delivery as a draft
- Edit existing drafts
- Submit a completed delivery
- Update and resubmit a delivery when changes are requested
- View rejection reasons
- View discrepancies reported during receipt

### Warehouse
A warehouse employee can:
- View submitted deliveries
- Review supplier delivery information
- Schedule a delivery
- Request changes from the supplier
- Reject a delivery with a reason
- View scheduled deliveries
- Process the receipt of a delivery
- Register zero or more discrepancies

## Delivery workflow
Main flow:
DRAFT → SUBMITTED → SCHEDULED → RECEIVED

Alternative transitions:
SUBMITTED → CHANGES_REQUESTED → SUBMITTED
SUBMITTED → REJECTED

A discrepancy is not a delivery status. A received delivery can have zero or more discrepancies.

## Local setup
### 1. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

### 2. Install Python dependencies
pip install -r requirements.txt

### 3. Install frontend dependencies
npm install

### 4. Configure PostgreSQL
Create a PostgreSQL database and user for the application.

Create a `.env` file in the project root:
DB_NAME=westocklots
DB_USER=westocklots_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

The database name and user may be changed as long as the values match the local PostgreSQL configuration.

### 5. Run database migrations
python manage.py migrate

### 6. Load seed data
python manage.py loaddata initial_data

### 7. Start Vite
npm run dev

### 8. Start Django
Open a second terminal, activate the virtual environment and run:
source .venv/bin/activate
python manage.py runserver


## Application routes
Supplier portal:
http://127.0.0.1:8000/supplier/1/


Warehouse portal:
http://127.0.0.1:8000/warehouse/deliveries/

The supplier ID depends on the available seed data.

## Tests
The core business rules and status transitions are covered by Django tests.
Run:
python manage.py test inbound

The test suite covers the supplier workflow, warehouse review, scheduling, requested changes, rejection, receipt and discrepancies.

## Scope
This implementation focuses on the core inbound delivery workflow as a vertical slice.
Authentication and production authorization are outside the scope of the assignment.
Possible production improvements include transactional receipt processing, more extensive validation, authorization, additional automated testing and further UI/UX refinement.

## AI usage
AI was used as a development sparring partner for guidance and troubleshooting. Design decisions, scope and the data model were determined and reviewed manually.
A detailed overview of AI usage is available in `ai_usage.md`.
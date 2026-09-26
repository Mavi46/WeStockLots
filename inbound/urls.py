from django.urls import path
from . import views

app_name = "inbound"

urlpatterns = [
    path(
        "supplier/<int:supplier_id>/",
        views.supplier_purchase_orders,
        name="supplier-purchase-orders",
    ),
]
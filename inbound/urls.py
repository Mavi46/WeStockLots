from django.urls import path
from . import views

app_name = "inbound"

urlpatterns = [
    path(
        "supplier/<int:supplier_id>/",
        views.supplier_purchase_orders,
        name="supplier-purchase-orders",
    ),
    path(
        "purchase-orders/<int:purchase_order_id>/deliveries/create/",
        views.create_delivery,
        name="create-delivery",
    ),
    path(
        "supplier/deliveries/<int:delivery_id>/edit/",
        views.edit_delivery,
        name="edit-delivery",
    ),
]
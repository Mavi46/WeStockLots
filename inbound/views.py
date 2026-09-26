from django.shortcuts import get_object_or_404, redirect
from inertia import render
from .models import Supplier, PurchaseOrder, Delivery
from django.views.decorators.http import require_POST
from django.contrib import messages
import json


def supplier_purchase_orders(request, supplier_id):
    supplier = get_object_or_404(
        Supplier.objects.prefetch_related("purchase_orders__deliveries"),
        pk=supplier_id,
    )

    purchase_orders = [
        {
            "id": purchase_order.id,
            "order_number": purchase_order.order_number,
            "deliveries": [
                {
                    "id": delivery.id,
                    "status": delivery.status,
                }
                for delivery in purchase_order.deliveries.all()
            ]
        }
        for purchase_order in supplier.purchase_orders.all()
    ]

    return render(
        request,
        "Supplier/PurchaseOrders",
        props={
            "supplier": {
                "id": supplier.id,
                "name": supplier.name,
            },
            "purchase_orders": purchase_orders,
        },
    )
    
@require_POST
def create_delivery(request, purchase_order_id):
    purchase_order = get_object_or_404(
        PurchaseOrder,
        pk=purchase_order_id,
    )

    Delivery.objects.create(
        purchase_order=purchase_order,
    )

    return redirect(
        "inbound:supplier-purchase-orders",
        supplier_id=purchase_order.supplier_id,
    )
    

def edit_delivery(request, delivery_id):
    delivery = get_object_or_404(
        Delivery.objects.select_related("purchase_order"),
        pk=delivery_id,
    )

    if request.method == "POST":
        data = json.loads(request.body)

        delivery.requested_delivery_date = (
            data.get("requested_delivery_date") or None
        )
        delivery.carrier = data.get("carrier", "")
        delivery.pallet_count = (
            data.get("pallet_count") or None
        )
        delivery.package_count = (
            data.get("package_count") or None
        )
        delivery.total_weight = (
            data.get("total_weight") or None
        )
        delivery.loading_metres = (
            data.get("loading_metres") or None
        )
        delivery.vehicle_registration = data.get(
            "vehicle_registration",
            "",
        )
        delivery.supplier_comments = data.get(
            "supplier_comments",
            "",
        )

        delivery.save()

        return redirect(
            "inbound:edit-delivery",
            delivery_id=delivery.id,
        )

    return render(
        request,
        "Supplier/EditDelivery",
        props={
            "delivery": {
                "id": delivery.id,
                "status": delivery.status,
                "purchase_order": {
                    "id": delivery.purchase_order.id,
                    "order_number": delivery.purchase_order.order_number,
                },
                "requested_delivery_date": (
                    delivery.requested_delivery_date.isoformat()
                    if delivery.requested_delivery_date
                    else ""
                ),
                "carrier": delivery.carrier,
                "pallet_count": delivery.pallet_count,
                "package_count": delivery.package_count,
                "total_weight": (
                    str(delivery.total_weight)
                    if delivery.total_weight is not None
                    else ""
                ),
                "loading_metres": (
                    str(delivery.loading_metres)
                    if delivery.loading_metres is not None
                    else ""
                ),
                "vehicle_registration": delivery.vehicle_registration,
                "supplier_comments": delivery.supplier_comments,
            },
        },
    )
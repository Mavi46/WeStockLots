from django.shortcuts import get_object_or_404, redirect
from inertia import render
from .models import Supplier, PurchaseOrder, Delivery
from django.views.decorators.http import require_POST


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
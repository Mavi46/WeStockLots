from django.shortcuts import get_object_or_404
from inertia import render
from .models import Supplier


def supplier_purchase_orders(request, supplier_id):
    supplier = get_object_or_404(
        Supplier.objects.prefetch_related("purchase_orders"),
        pk=supplier_id,
    )

    purchase_orders = [
        {
            "id": purchase_order.id,
            "order_number": purchase_order.order_number,
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
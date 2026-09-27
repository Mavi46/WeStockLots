from django.shortcuts import get_object_or_404, redirect
from inertia import render, share
from .models import Supplier, PurchaseOrder, Delivery, Warehouse
from django.views.decorators.http import require_POST
from django.contrib import messages
import json
from django.http import HttpResponseForbidden


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
                    "warehouse_comment": delivery.warehouse_comment,
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
    

def validate_delivery_submission(data):
    errors = {}

    if not data.get("requested_delivery_date"):
        errors["requested_delivery_date"] = "Requested delivery date is required."

    if not data.get("carrier"):
        errors["carrier"] = "Carrier is required."

    if not data.get("pallet_count") and not data.get("package_count"):
        errors["pallet_count"] = (
            "Enter at least a pallet count or package count."
        )

    if not data.get("total_weight"):
        errors["total_weight"] = "Total weight is required."

    if not data.get("vehicle_registration"):
        errors["vehicle_registration"] = (
            "Vehicle registration is required."
        )

    return errors


def edit_delivery(request, delivery_id):
    delivery = get_object_or_404(
        Delivery.objects.select_related("purchase_order"),
        pk=delivery_id,
    )
    
    if delivery.status not in [
        Delivery.Status.DRAFT,
        Delivery.Status.CHANGES_REQUESTED,
    ]:
        return HttpResponseForbidden(
            "This delivery can no longer be edited."
        )

    if request.method == "POST":
        data = json.loads(request.body)
        
        action = data.get("action", "save")

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

        if action == "submit":
            errors = validate_delivery_submission(data)

            if errors:
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
                            "requested_delivery_date": data.get(
                                "requested_delivery_date",
                                "",
                            ),
                            "carrier": data.get("carrier", ""),
                            "pallet_count": (
                                data.get("pallet_count") or None
                            ),
                            "package_count": (
                                data.get("package_count") or None
                            ),
                            "total_weight": data.get(
                                "total_weight",
                                "",
                            ),
                            "loading_metres": data.get(
                                "loading_metres",
                                "",
                            ),
                            "vehicle_registration": data.get(
                                "vehicle_registration",
                                "",
                            ),
                            "supplier_comments": data.get(
                                "supplier_comments",
                                "",
                            ),
                            "warehouse_comment": (
                                delivery.warehouse_comment
                            ),
                        },
                        "errors": errors,
                    },
                )

            delivery.status = Delivery.Status.SUBMITTED

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
                "warehouse_comment": delivery.warehouse_comment,
            },
        },
    )
    

def warehouse_deliveries(request):
    deliveries = (
        Delivery.objects
        .filter(status=Delivery.Status.SUBMITTED)
        .select_related(
            "purchase_order",
            "purchase_order__supplier",
        )
        .order_by("id")
    )

    return render(
        request,
        "Warehouse/Deliveries",
        props={
            "deliveries": [
                {
                    "id": delivery.id,
                    "status": delivery.status,
                    "purchase_order": {
                        "id": delivery.purchase_order.id,
                        "order_number": delivery.purchase_order.order_number,
                    },
                    "supplier": {
                        "id": delivery.purchase_order.supplier.id,
                        "name": delivery.purchase_order.supplier.name,
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
                    "vehicle_registration": delivery.vehicle_registration,
                }
                for delivery in deliveries
            ],
        },
    )
    
    
def review_delivery(request, delivery_id):
    delivery = get_object_or_404(
        Delivery.objects.select_related(
            "purchase_order",
            "purchase_order__supplier",
        ),
        pk=delivery_id,
        status=Delivery.Status.SUBMITTED,
    )

    warehouses = Warehouse.objects.order_by("id")

    if request.method == "POST":
        data = json.loads(request.body)

        action = data.get("action")
        warehouse_id = data.get("warehouse_id")
        scheduled_at = data.get("scheduled_at")
        warehouse_comment = data.get(
            "warehouse_comment",
            "",
        )

        errors = {}

        if action == "schedule":
            if not warehouse_id:
                errors["warehouse_id"] = (
                    "Warehouse is required."
                )

            if not scheduled_at:
                errors["scheduled_at"] = (
                    "Scheduled date and time is required."
                )

        elif action == "request_changes":
            if not warehouse_comment.strip():
                errors["warehouse_comment"] = (
                    "Warehouse comment is required when requesting changes."
                )
                
        elif action == "reject":
            if not warehouse_comment.strip():
                errors["warehouse_comment"] = (
                    "Warehouse comment is required when rejecting a delivery."
                )

        if errors:
            return render(
                request,
                "Warehouse/ReviewDelivery",
                props={
                    "delivery": {
                        "id": delivery.id,
                        "status": delivery.status,
                        "purchase_order": {
                            "id": delivery.purchase_order.id,
                            "order_number": delivery.purchase_order.order_number,
                        },
                        "supplier": {
                            "id": delivery.purchase_order.supplier.id,
                            "name": delivery.purchase_order.supplier.name,
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
                        "vehicle_registration": (
                            delivery.vehicle_registration
                        ),
                        "supplier_comments": (
                            delivery.supplier_comments
                        ),
                    },
                    "warehouses": [
                        {
                            "id": warehouse.id,
                            "name": warehouse.name,
                            "location": warehouse.location,
                        }
                        for warehouse in warehouses
                    ],
                    "errors": errors,
                },
            )

        if action == "schedule":
            warehouse = get_object_or_404(
                Warehouse,
                pk=warehouse_id,
            )

            delivery.warehouse = warehouse
            delivery.scheduled_at = scheduled_at
            delivery.warehouse_comment = warehouse_comment
            delivery.status = Delivery.Status.SCHEDULED

        elif action == "request_changes":
            delivery.warehouse_comment = warehouse_comment
            delivery.status = Delivery.Status.CHANGES_REQUESTED
            
        elif action == "reject":
            delivery.warehouse_comment = warehouse_comment
            delivery.status = Delivery.Status.REJECTED

        delivery.save()

        return redirect(
            "inbound:warehouse-deliveries"
        )

    return render(
        request,
        "Warehouse/ReviewDelivery",
        props={
            "delivery": {
                "id": delivery.id,
                "status": delivery.status,
                "purchase_order": {
                    "id": delivery.purchase_order.id,
                    "order_number": delivery.purchase_order.order_number,
                },
                "supplier": {
                    "id": delivery.purchase_order.supplier.id,
                    "name": delivery.purchase_order.supplier.name,
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
                "vehicle_registration": (
                    delivery.vehicle_registration
                ),
                "supplier_comments": (
                    delivery.supplier_comments
                ),
            },
            "warehouses": [
                {
                    "id": warehouse.id,
                    "name": warehouse.name,
                    "location": warehouse.location,
                }
                for warehouse in warehouses
            ],
        },
    )
import json

from django.test import TestCase
from django.urls import reverse

from .models import (
    Supplier,
    PurchaseOrder,
    Delivery,
    Warehouse,
    Discrepancy,
)


class SupplierDeliveryTests(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Test Supplier",
        )

        self.purchase_order = PurchaseOrder.objects.create(
            supplier=self.supplier,
            order_number="PO-TEST-001",
        )

        self.delivery = Delivery.objects.create(
            purchase_order=self.purchase_order,
        )

    def test_valid_draft_can_be_submitted(self):
        response = self.client.post(
            reverse(
                "inbound:edit-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "submit",
                "requested_delivery_date": "2026-10-10",
                "carrier": "Test Carrier",
                "pallet_count": "10",
                "package_count": "",
                "total_weight": "1000",
                "loading_metres": "5",
                "vehicle_registration": "TEST-123",
                "supplier_comments": "",
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.SUBMITTED,
        )

        self.assertEqual(
            response.status_code,
            302,
        )

    def test_incomplete_draft_cannot_be_submitted(self):
        response = self.client.post(
            reverse(
                "inbound:edit-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "submit",
                "requested_delivery_date": "",
                "carrier": "",
                "pallet_count": "",
                "package_count": "",
                "total_weight": "",
                "loading_metres": "",
                "vehicle_registration": "",
                "supplier_comments": "",
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.DRAFT,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

    def test_submitted_delivery_cannot_be_edited(self):
        self.delivery.status = Delivery.Status.SUBMITTED
        self.delivery.save()

        response = self.client.post(
            reverse(
                "inbound:edit-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "save",
                "carrier": "Changed Carrier",
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            response.status_code,
            403,
        )

        self.assertNotEqual(
            self.delivery.carrier,
            "Changed Carrier",
        )

    def test_changes_requested_delivery_can_be_resubmitted(self):
        self.delivery.status = Delivery.Status.CHANGES_REQUESTED
        self.delivery.warehouse_comment = (
            "Please correct the delivery information."
        )
        self.delivery.save()

        response = self.client.post(
            reverse(
                "inbound:edit-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "submit",
                "requested_delivery_date": "2026-10-10",
                "carrier": "Test Carrier",
                "pallet_count": "10",
                "package_count": "",
                "total_weight": "1000",
                "loading_metres": "5",
                "vehicle_registration": "TEST-123",
                "supplier_comments": (
                    "Delivery information corrected."
                ),
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.SUBMITTED,
        )

        self.assertEqual(
            response.status_code,
            302,
        )


class WarehouseDeliveryTests(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Test Supplier",
        )

        self.purchase_order = PurchaseOrder.objects.create(
            supplier=self.supplier,
            order_number="PO-TEST-001",
        )

        self.warehouse = Warehouse.objects.create(
            name="Test Warehouse",
            location="Test Location",
        )

        self.delivery = Delivery.objects.create(
            purchase_order=self.purchase_order,
            status=Delivery.Status.SUBMITTED,
            requested_delivery_date="2026-10-10",
            carrier="Test Carrier",
            pallet_count=10,
            total_weight=1000,
            vehicle_registration="TEST-123",
        )

    def test_submitted_delivery_can_be_scheduled(self):
        response = self.client.post(
            reverse(
                "inbound:review-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "schedule",
                "warehouse_id": self.warehouse.id,
                "scheduled_at": "2026-10-10T10:00",
                "warehouse_comment": "",
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.SCHEDULED,
        )

        self.assertEqual(
            self.delivery.warehouse,
            self.warehouse,
        )

        self.assertIsNotNone(
            self.delivery.scheduled_at,
        )

        self.assertEqual(
            response.status_code,
            302,
        )

    def test_delivery_cannot_be_scheduled_without_warehouse_and_date(self):
        response = self.client.post(
            reverse(
                "inbound:review-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "schedule",
                "warehouse_id": "",
                "scheduled_at": "",
                "warehouse_comment": "",
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.SUBMITTED,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

    def test_warehouse_can_request_changes(self):
        response = self.client.post(
            reverse(
                "inbound:review-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "request_changes",
                "warehouse_id": "",
                "scheduled_at": "",
                "warehouse_comment": (
                    "Please correct the pallet count."
                ),
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.CHANGES_REQUESTED,
        )

        self.assertEqual(
            self.delivery.warehouse_comment,
            "Please correct the pallet count.",
        )

        self.assertEqual(
            response.status_code,
            302,
        )

    def test_changes_cannot_be_requested_without_comment(self):
        response = self.client.post(
            reverse(
                "inbound:review-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "request_changes",
                "warehouse_id": "",
                "scheduled_at": "",
                "warehouse_comment": "",
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.SUBMITTED,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

    def test_warehouse_can_reject_delivery(self):
        response = self.client.post(
            reverse(
                "inbound:review-delivery",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "action": "reject",
                "warehouse_id": "",
                "scheduled_at": "",
                "warehouse_comment": (
                    "Delivery cannot be accepted."
                ),
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.REJECTED,
        )

        self.assertEqual(
            self.delivery.warehouse_comment,
            "Delivery cannot be accepted.",
        )

        self.assertEqual(
            response.status_code,
            302,
        )


class ReceiptTests(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Test Supplier",
        )

        self.purchase_order = PurchaseOrder.objects.create(
            supplier=self.supplier,
            order_number="PO-TEST-001",
        )

        self.warehouse = Warehouse.objects.create(
            name="Test Warehouse",
            location="Test Location",
        )

        self.delivery = Delivery.objects.create(
            purchase_order=self.purchase_order,
            status=Delivery.Status.SCHEDULED,
            requested_delivery_date="2026-10-10",
            carrier="Test Carrier",
            pallet_count=10,
            total_weight=1000,
            vehicle_registration="TEST-123",
            warehouse=self.warehouse,
        )

    def test_scheduled_delivery_can_be_received_without_discrepancies(self):
        response = self.client.post(
            reverse(
                "inbound:record-receipt",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "discrepancies": [],
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.RECEIVED,
        )

        self.assertEqual(
            Discrepancy.objects.filter(
                delivery=self.delivery,
            ).count(),
            0,
        )

        self.assertEqual(
            response.status_code,
            302,
        )

    def test_scheduled_delivery_can_be_received_with_discrepancy(self):
        response = self.client.post(
            reverse(
                "inbound:record-receipt",
                args=[self.delivery.id],
            ),
            data=json.dumps({
                "discrepancies": [
                    {
                        "type": Discrepancy.Type.DAMAGED_GOODS,
                        "description": "One pallet was damaged.",
                    },
                ],
            }),
            content_type="application/json",
        )

        self.delivery.refresh_from_db()

        self.assertEqual(
            self.delivery.status,
            Delivery.Status.RECEIVED,
        )

        discrepancy = Discrepancy.objects.get(
            delivery=self.delivery,
        )

        self.assertEqual(
            discrepancy.type,
            Discrepancy.Type.DAMAGED_GOODS,
        )

        self.assertEqual(
            discrepancy.description,
            "One pallet was damaged.",
        )

        self.assertEqual(
            response.status_code,
            302,
        )
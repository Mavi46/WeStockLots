from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    

class PurchaseOrder(models.Model):
    order_number = models.CharField(max_length=100, unique=True)
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="purchase_orders",
    )
    
    def __str__(self):
        return self.order_number
    

class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
            return self.name
        

class Delivery(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SUBMITTED = "submitted", "Submitted"
        CHANGES_REQUESTED = "changes_requested", "Changes requested"
        SCHEDULED = "scheduled", "Scheduled"
        RECEIVED = "received", "Received"
        REJECTED = "rejected", "Rejected"
        
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.PROTECT,
        related_name="deliveries",
    )
    
    requested_delivery_date = models.DateField(null=True, blank=True)
    carrier = models.CharField(max_length=255, blank=True)
    
    pallet_count = models.PositiveIntegerField(null=True, blank=True)
    package_count = models.PositiveIntegerField(null=True, blank=True)
    
    total_weight = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    
    loading_metres = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
    )
    
    vehicle_registration = models.CharField(max_length=50, blank=True)
    supplier_comments = models.TextField(blank=True)
    
    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="deliveries",
        null=True,
        blank=True,
    )
    
    scheduled_at = models.DateTimeField(null=True, blank=True)
    warehouse_comment = models.TextField(blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    
    def __str__(self):
        return f"Delivery {self.pk} - {self.purchase_order.order_number}"
    

class Discrepancy(models.Model):
    class Type(models.TextChoices):
        QUANTITY = "quantity", "Quantity"
        DAMAGED_GOODS = "damaged_goods", "Damaged goods"
        INCORRECT_PRODUCTS = "incorrect_products", "Incorrect products"
        PALLET_PACKAGE_COUNT = "pallet_package_count", "Pallet/package count"
        OTHER = "other", "Other"

    delivery = models.ForeignKey(
        Delivery,
        on_delete=models.CASCADE,
        related_name="discrepancies",
    )

    type = models.CharField(
        max_length=30,
        choices=Type.choices,
    )

    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_type_display()} - Delivery {self.delivery_id}"
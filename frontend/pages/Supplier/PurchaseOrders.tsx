import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Supplier = {
    id: number;
    name: string;
};

type Delivery = {
    id: number;
    status: string;
    warehouse_comment?: string;
};

type PurchaseOrder = {
    id: number;
    order_number: string;
    deliveries: Delivery[];
};

type Props = {
    supplier: Supplier;
    purchase_orders: PurchaseOrder[];
};

export default function PurchaseOrders({
    supplier,
    purchase_orders,
}: Props) {
    function createDelivery(purchaseOrderId: number) {
        router.post(
            `/purchase-orders/${purchaseOrderId}/deliveries/create/`
        );
    }

    function editDelivery(deliveryId: number) {
        router.get(
            `/supplier/deliveries/${deliveryId}/edit/`
        );
    }

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">
                {supplier.name}
            </h1>

            <h2 className="mt-6 text-xl font-semibold">
                Purchase orders
            </h2>

            <div className="mt-4 space-y-2">
                {purchase_orders.map((purchaseOrder) => (
                    <div
                        key={purchaseOrder.id}
                        className="rounded-md border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium">
                                {purchaseOrder.order_number}
                            </span>

                            <Button
                                onClick={() =>
                                    createDelivery(purchaseOrder.id)
                                }
                            >
                                Create delivery
                            </Button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {purchaseOrder.deliveries.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No deliveries
                                </p>
                            ) : (
                                purchaseOrder.deliveries.map((delivery) => (
                                    <div
                                        key={delivery.id}
                                        className="flex items-center justify-between rounded-md bg-muted p-3"
                                    >
                                        <span>
                                            Delivery #{delivery.id} — {delivery.status} {delivery.status === "rejected" && delivery.warehouse_comment && (
                                                <div>
                                                    Reason: {delivery.warehouse_comment}
                                                </div>
                                            )}
                                        </span>

                                        {(
                                            delivery.status === "draft" ||
                                            delivery.status === "changes_requested"
                                        ) && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        editDelivery(delivery.id)
                                                    }
                                                >
                                                    Edit delivery
                                                </Button>
                                            )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
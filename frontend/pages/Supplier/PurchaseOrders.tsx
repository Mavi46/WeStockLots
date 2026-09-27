import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Supplier = {
    id: number;
    name: string;
};

type Discrepancy = {
    id: number;
    type: string;
    description: string;
};

type Delivery = {
    id: number;
    status: string;
    warehouse_comment?: string;
    discrepancies: Discrepancy[];
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
                                        className="rounded-md bg-muted p-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>
                                                Delivery #{delivery.id} —{" "}
                                                {delivery.status}
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

                                        {delivery.status === "rejected" &&
                                            delivery.warehouse_comment && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium">
                                                        Rejection reason
                                                    </p>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {delivery.warehouse_comment}
                                                    </p>
                                                </div>
                                            )}

                                        {delivery.status === "received" && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium">
                                                    Discrepancies
                                                </p>

                                                {delivery.discrepancies.length === 0 ? (
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        No discrepancies reported.
                                                    </p>
                                                ) : (
                                                    <div className="mt-2 space-y-2">
                                                        {delivery.discrepancies.map(
                                                            (discrepancy) => (
                                                                <div
                                                                    key={discrepancy.id}
                                                                    className="rounded-md border p-3"
                                                                >
                                                                    <p className="text-sm font-medium capitalize">
                                                                        {discrepancy.type}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {discrepancy.description}
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
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
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Supplier = {
    id: number;
    name: string;
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

type Delivery = {
    id: number;
    status: string;
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

                            <Button onClick={() => createDelivery(purchaseOrder.id)}>
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
                                        Delivery #{delivery.id} — {delivery.status}
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
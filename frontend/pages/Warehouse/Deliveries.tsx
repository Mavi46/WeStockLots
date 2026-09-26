import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Delivery = {
    id: number;
    status: string;

    purchase_order: {
        id: number;
        order_number: string;
    };

    supplier: {
        id: number;
        name: string;
    };

    requested_delivery_date: string;
    carrier: string;
    pallet_count: number | null;
    package_count: number | null;
    total_weight: string;
    vehicle_registration: string;
};

type Props = {
    deliveries: Delivery[];
};

export default function Deliveries({ deliveries }: Props) {
    function reviewDelivery(deliveryId: number) {
        router.get(
            `/warehouse/deliveries/${deliveryId}/review/`
        );
    }
    return (
        <main className="mx-auto max-w-4xl p-10">
            <h1 className="text-3xl font-bold">
                Incoming deliveries
            </h1>

            <p className="mt-2 text-muted-foreground">
                Deliveries waiting for warehouse review.
            </p>

            <div className="mt-8 space-y-4">
                {deliveries.length === 0 ? (
                    <p className="text-muted-foreground">
                        No deliveries waiting for review.
                    </p>
                ) : (
                    deliveries.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="rounded-md border p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-semibold">
                                        Delivery #{delivery.id}
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        {delivery.purchase_order.order_number}
                                        {" — "}
                                        {delivery.supplier.name}
                                    </p>
                                </div>

                                <span className="text-sm font-medium">
                                    {delivery.status}
                                </span>
                            </div>

                            <div className="mt-4 space-y-1 text-sm">
                                <p>
                                    Requested date:{" "}
                                    {delivery.requested_delivery_date}
                                </p>

                                <p>
                                    Carrier: {delivery.carrier}
                                </p>

                                <p>
                                    Pallets:{" "}
                                    {delivery.pallet_count ?? "-"}
                                </p>

                                <p>
                                    Packages:{" "}
                                    {delivery.package_count ?? "-"}
                                </p>

                                <p>
                                    Total weight: {delivery.total_weight}
                                </p>

                                <p>
                                    Vehicle registration:{" "}
                                    {delivery.vehicle_registration}
                                </p>
                            </div>

                            <div className="mt-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => reviewDelivery(delivery.id)}
                                >
                                    Review delivery
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
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
    loading_metres: string;
    vehicle_registration: string;
    supplier_comments: string;
};

type Props = {
    delivery: Delivery;
};

export default function ReviewDelivery({ delivery }: Props) {
    return (
        <main className="mx-auto max-w-3xl p-10">
            <Button
                type="button"
                variant="outline"
                onClick={() =>
                    router.get("/warehouse/deliveries/")
                }
            >
                Back
            </Button>

            <div className="mt-6">
                <h1 className="text-3xl font-bold">
                    Review delivery #{delivery.id}
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Review the information submitted by the supplier.
                </p>
            </div>

            <div className="mt-8 rounded-md border p-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Status
                        </p>
                        <p className="font-medium">
                            {delivery.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Supplier
                        </p>
                        <p className="font-medium">
                            {delivery.supplier.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Purchase order
                        </p>
                        <p className="font-medium">
                            {delivery.purchase_order.order_number}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Requested delivery date
                        </p>
                        <p className="font-medium">
                            {delivery.requested_delivery_date}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Carrier
                        </p>
                        <p className="font-medium">
                            {delivery.carrier}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Pallet count
                        </p>
                        <p className="font-medium">
                            {delivery.pallet_count ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Package count
                        </p>
                        <p className="font-medium">
                            {delivery.package_count ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Total weight
                        </p>
                        <p className="font-medium">
                            {delivery.total_weight}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Loading metres
                        </p>
                        <p className="font-medium">
                            {delivery.loading_metres || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Vehicle registration
                        </p>
                        <p className="font-medium">
                            {delivery.vehicle_registration}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Supplier comments
                        </p>
                        <p className="font-medium">
                            {delivery.supplier_comments || "-"}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
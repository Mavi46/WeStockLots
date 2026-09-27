import { router, useForm } from "@inertiajs/react";
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
    warehouses: Warehouse[];
    errors?: Record<string, string>;
};

type Warehouse = {
    id: number;
    name: string;
    location: string;
};

export default function ReviewDelivery({ delivery, warehouses, errors = {} }: Props) {
    const { data, setData, post, processing, transform } = useForm({
        warehouse_id: "",
        scheduled_at: "",
        warehouse_comment: "",
    });

    function scheduleDelivery() {
        transform((data) => ({
            ...data,
            action: "schedule",
        }));

        post(
            `/warehouse/deliveries/${delivery.id}/review/`,
            {
                preserveScroll: true,
            }
        );
    }

    function requestChanges() {
        transform((data) => ({
            ...data,
            action: "request_changes",
        }));

        post(
            `/warehouse/deliveries/${delivery.id}/review/`,
            {
                preserveScroll: true,
            }
        );
    }

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

            <div className="mt-8 rounded-md border p-6">
                <h2 className="text-xl font-semibold">
                    Schedule delivery
                </h2>

                <div className="mt-5 space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Warehouse
                        </label>

                        <select
                            value={data.warehouse_id}
                            onChange={(event) =>
                                setData("warehouse_id", event.target.value)
                            }
                            className="w-full rounded-md border bg-background p-2"
                        >
                            <option value="">
                                Select warehouse
                            </option>

                            {warehouses.map((warehouse) => (
                                <option
                                    key={warehouse.id}
                                    value={warehouse.id}
                                >
                                    {warehouse.name} — {warehouse.location}
                                </option>
                            ))}
                        </select>
                        {errors.warehouse_id && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.warehouse_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Scheduled date and time
                        </label>

                        <input
                            type="datetime-local"
                            value={data.scheduled_at}
                            onChange={(event) =>
                                setData("scheduled_at", event.target.value)
                            }
                            className="w-full rounded-md border p-2"
                        />
                        {errors.scheduled_at && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.scheduled_at}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Warehouse comment
                        </label>

                        <textarea
                            value={data.warehouse_comment}
                            onChange={(event) =>
                                setData(
                                    "warehouse_comment",
                                    event.target.value
                                )
                            }
                            className="min-h-24 w-full rounded-md border p-2"
                        />
                        {errors.warehouse_comment && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.warehouse_comment}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={scheduleDelivery}
                            disabled={processing}
                        >
                            {processing ? "Scheduling..." : "Schedule delivery"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={requestChanges}
                            disabled={processing}
                        >
                            Request changes
                        </Button>
                    </div>
                </div>
            </div>

        </main>
    );
}
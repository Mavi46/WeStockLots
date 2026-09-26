import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Delivery = {
    id: number;
    status: string;

    purchase_order: {
        id: number;
        order_number: string;
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
    errors?: Record<string, string>
};

export default function EditDelivery({ delivery, errors = {}, }: Props) {
    const { data, setData, post, processing, transform, } = useForm({
        requested_delivery_date: delivery.requested_delivery_date,
        carrier: delivery.carrier,
        pallet_count: delivery.pallet_count?.toString() ?? "",
        package_count: delivery.package_count?.toString() ?? "",
        total_weight: delivery.total_weight,
        loading_metres: delivery.loading_metres,
        vehicle_registration: delivery.vehicle_registration,
        supplier_comments: delivery.supplier_comments,
    });

    function saveDraft() {
        transform((data) => ({
            ...data,
            action: "save",
        }));

        post(`/supplier/deliveries/${delivery.id}/edit/`, {
            preserveScroll: true,
        });
    }

    function submitDelivery() {
        transform((data) => ({
            ...data,
            action: "submit",
        }));

        post(`/supplier/deliveries/${delivery.id}/edit/`, {
            preserveScroll: true,
        });
    }

    return (
        <main className="mx-auto max-w-2xl p-10">
            <h1 className="text-3xl font-bold">
                Edit delivery
            </h1>

            <p className="mt-2 text-muted-foreground">
                {delivery.purchase_order.order_number}
            </p>

            <div className="mt-8 space-y-5">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Requested delivery date
                    </label>

                    <input
                        type="date"
                        value={data.requested_delivery_date}
                        onChange={(event) =>
                            setData(
                                "requested_delivery_date",
                                event.target.value
                            )
                        }
                        className="w-full rounded-md border p-2"
                    />
                    {errors.requested_delivery_date && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.requested_delivery_date}
                        </p>

                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Carrier
                    </label>

                    <input
                        type="text"
                        value={data.carrier}
                        onChange={(event) =>
                            setData("carrier", event.target.value)
                        }
                        className="w-full rounded-md border p-2"
                    />
                    {errors.carrier && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.carrier}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Pallet count
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={data.pallet_count}
                        onChange={(event) =>
                            setData("pallet_count", event.target.value)
                        }
                        className="w-full rounded-md border p-2"
                    />
                    {errors.pallet_count && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.pallet_count}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Package count
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={data.package_count}
                        onChange={(event) =>
                            setData("package_count", event.target.value)
                        }
                        className="w-full rounded-md border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Total weight
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.total_weight}
                        onChange={(event) =>
                            setData("total_weight", event.target.value)
                        }
                        className="w-full rounded-md border p-2"
                    />
                    {errors.total_weight && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.total_weight}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Loading metres
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.loading_metres}
                        onChange={(event) =>
                            setData("loading_metres", event.target.value)
                        }
                        className="w-full rounded-md border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Vehicle registration
                    </label>

                    <input
                        type="text"
                        value={data.vehicle_registration}
                        onChange={(event) =>
                            setData(
                                "vehicle_registration",
                                event.target.value
                            )
                        }
                        className="w-full rounded-md border p-2"
                    />
                    {errors.vehicle_registration && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.vehicle_registration}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Supplier comments
                    </label>

                    <textarea
                        value={data.supplier_comments}
                        onChange={(event) =>
                            setData(
                                "supplier_comments",
                                event.target.value
                            )
                        }
                        className="min-h-24 w-full rounded-md border p-2"
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        onClick={saveDraft}
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Save draft"}
                    </Button>

                    <Button
                        type="button"
                        onClick={submitDelivery}
                        disabled={processing}
                    >
                        {processing ? "Submitting..." : "Submit delivery"}
                    </Button>
                </div>
            </div>
        </main>
    );
}
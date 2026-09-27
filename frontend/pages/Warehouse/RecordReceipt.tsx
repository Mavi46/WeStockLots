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

    warehouse: {
        id: number;
        name: string;
        location: string;
    };
};

type Discrepancy = {
    type: string;
    description: string;
};

type Props = {
    delivery: Delivery;
    errors?: Record<string, string>;
};

export default function RecordReceipt({
    delivery,
    errors = {},
}: Props) {
    const {
        data,
        setData,
        post,
        processing,
    } = useForm<{
        discrepancies: Discrepancy[];
    }>({
        discrepancies: [],
    });

    function addDiscrepancy() {
        setData("discrepancies", [
            ...data.discrepancies,
            {
                type: "",
                description: "",
            },
        ]);
    }

    function removeDiscrepancy(index: number) {
        setData(
            "discrepancies",
            data.discrepancies.filter(
                (_, currentIndex) => currentIndex !== index
            )
        );
    }

    function updateDiscrepancy(
        index: number,
        field: keyof Discrepancy,
        value: string
    ) {
        const updated = [...data.discrepancies];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setData("discrepancies", updated);
    }

    function receiveDelivery() {
        post(
            `/warehouse/deliveries/${delivery.id}/receipt/`,
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

            <h1 className="mt-6 text-3xl font-bold">
                Process delivery
            </h1>

            <div className="mt-6 rounded-md border p-5">
                <p>
                    <strong>Delivery:</strong> #{delivery.id}
                </p>

                <p>
                    <strong>Purchase order:</strong>{" "}
                    {delivery.purchase_order.order_number}
                </p>

                <p>
                    <strong>Supplier:</strong>{" "}
                    {delivery.supplier.name}
                </p>

                <p>
                    <strong>Warehouse:</strong>{" "}
                    {delivery.warehouse.name}
                </p>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Discrepancies
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Add any discrepancies found during receipt.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addDiscrepancy}
                    >
                        Add discrepancy
                    </Button>
                </div>

                <div className="mt-5 space-y-5">
                    {data.discrepancies.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No discrepancies recorded.
                        </p>
                    )}

                    {data.discrepancies.map(
                        (discrepancy, index) => (
                            <div
                                key={index}
                                className="rounded-md border p-5"
                            >
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Type
                                    </label>

                                    <select
                                        value={discrepancy.type}
                                        onChange={(event) =>
                                            updateDiscrepancy(
                                                index,
                                                "type",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-md border bg-background p-2"
                                    >
                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="quantity">
                                            Quantity
                                        </option>

                                        <option value="damaged_goods">
                                            Damaged goods
                                        </option>

                                        <option value="incorrect_products">
                                            Incorrect products
                                        </option>

                                        <option value="pallet_package_count">
                                            Pallet/package count
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                    {errors[
                                        `discrepancy_${index}_type`
                                    ] && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {
                                                    errors[
                                                    `discrepancy_${index}_type`
                                                    ]
                                                }
                                            </p>
                                        )}
                                </div>

                                <div className="mt-4">
                                    <label className="mb-1 block text-sm font-medium">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            discrepancy.description
                                        }
                                        onChange={(event) =>
                                            updateDiscrepancy(
                                                index,
                                                "description",
                                                event.target.value
                                            )
                                        }
                                        className="min-h-24 w-full rounded-md border p-2"
                                    />

                                    {errors[
                                        `discrepancy_${index}_description`
                                    ] && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {
                                                    errors[
                                                    `discrepancy_${index}_description`
                                                    ]
                                                }
                                            </p>
                                        )}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() =>
                                        removeDiscrepancy(index)
                                    }
                                >
                                    Remove discrepancy
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="mt-8">
                <Button
                    type="button"
                    onClick={receiveDelivery}
                    disabled={processing}
                >
                    {processing
                        ? "Recording..."
                        : "Confirm receipt"}
                </Button>
            </div>
        </main>
    );
}
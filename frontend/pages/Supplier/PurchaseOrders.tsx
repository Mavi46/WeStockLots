type Supplier = {
    id: number;
    name: string;
};

type PurchaseOrder = {
    id: number;
    order_number: string;
};

type Props = {
    supplier: Supplier;
    purchase_orders: PurchaseOrder[];
};

export default function PurchaseOrders({
    supplier,
    purchase_orders,
}: Props) {
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
                        {purchaseOrder.order_number}
                    </div>
                ))}
            </div>
        </main>
    );
}
// export default function Home() {

//     return (

//         <main>

//             <h1>Django + Inertia + React</h1>

//             <p>The frontend is working.</p>

//         </main>

//     );

// }
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">
                Django + Inertia + React
            </h1>

            <p className="mt-2 text-gray-500">
                Frontend is working.
            </p>
            <Button className="mt-4">
                Test button
            </Button>
        </main>
    );
}
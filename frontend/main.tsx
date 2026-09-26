import "@vitejs/plugin-react/preamble";
import { createInertiaApp } from "@inertiajs/react";
import "./styles/globals.css";

const pages = import.meta.glob("./pages/**/*.tsx");

createInertiaApp({
    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        const module = await page() as {
            default: React.ComponentType;
        };

        return module.default;
    },

    http: {
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
    },
});
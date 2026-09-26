import "@vitejs/plugin-react/preamble";
import { createInertiaApp } from "@inertiajs/react";
import "./styles/globals.css";

const pages = import.meta.glob("./pages/**/*.tsx", {
    eager: true,
});

createInertiaApp({
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`] as {
            default: React.ComponentType;
        };

        return page.default;
    },

    http: {
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
    },
});
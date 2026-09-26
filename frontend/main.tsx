import "@vitejs/plugin-react/preamble";
import { createInertiaApp } from "@inertiajs/react";
import "@vitejs/plugin-react/preamble";
import "./styles/globals.css";

import Home from "./pages/Home";

createInertiaApp({
    resolve: (name) => {
        const pages = {
            Home,
        };

        return pages[name as keyof typeof pages];
    },

    http: {
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
    },
});
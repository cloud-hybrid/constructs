import "./index.scss";

import React from "react";
import DOM from "react-dom";

import { BrowserRouter as Router } from "react-router-dom";

import { Application } from "./application";

DOM.render(
    <React.StrictMode>
        <Router>
            <Application/>
        </Router>
    </React.StrictMode>,
    document.getElementById("Application")
);
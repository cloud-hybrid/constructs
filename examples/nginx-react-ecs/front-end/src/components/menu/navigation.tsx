import "./index.scss";

import Styles from "./index.module.scss";

import React from "react";

const Component = ( { as = "nav", children = null } ) => {
    return React.createElement(as, {
        className: Styles.component,
        children: children
    });
};

export default Component;

export { Component as Navigator };

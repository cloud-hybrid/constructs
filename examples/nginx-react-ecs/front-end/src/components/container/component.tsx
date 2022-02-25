import "./index.scss";

import Styles from "./index.module.scss";

import Properties from "prop-types";

const Component = ( { children = null } ) => {
    return (
        <main className={ Styles.component }>
            {
                children
            }
        </main>
    )
};

Component.propTypes = {
    /*** Children JSX Components */
    children: Properties.node.isRequired
};

Component.defaultProps = {
    children: null
};

export default Component;

export { Component };
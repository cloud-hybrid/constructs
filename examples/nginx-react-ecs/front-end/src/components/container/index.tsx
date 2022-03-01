import "./index.scss";

import Styles from "./index.module.scss";

const Component = ( { children = null } ) => {
    return (
        <main className={ Styles.component }>
            {
                children
            }
        </main>
    )
};

export default Component;

export { Component as Container };
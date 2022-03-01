import "./index.scss";

import Styles from "./index.module.scss";

import { Strings } from "../imports";

const Component = ( { name, children } ) => {
    return (
        <div id={ Strings.normalize(name, "Page", "Wrapper") } className={ Styles.component }>
            {
                children
            }
        </div>
    );
};

export default Component;

export { Component };
import "./index.scss";

import Styles from "./index.module.scss";

import { Link } from "react-router-dom";

const Component = ( { path = "/", prefix, title } ) => {
    return (
        <Link to={ path } className={ Styles.global }>
            <span>
                <span className={ Styles.prefix }>
                    {
                        prefix
                    }
                </span>
                {
                    title
                }
            </span>
        </Link>
    );
};

export default Component;

export { Component as Global };
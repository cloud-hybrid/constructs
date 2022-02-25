import "./index.scss";

import Styles from "./index.module.scss";

import Properties from "prop-types";

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

Component.propTypes = {
    /*** Global Root Path. Defaults to `"/"` */
    path: Properties.string,
    
    /*** Global Header Title, Prefix */
    prefix: Properties.string.isRequired,

    /*** Global Header Title, Text */
    title: Properties.string.isRequired
};

Component.defaultProps = {
    path: "/"
};

export default Component;

export { Component as Global };
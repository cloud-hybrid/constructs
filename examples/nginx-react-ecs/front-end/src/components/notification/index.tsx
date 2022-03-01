import "./index.scss";

import Styles from "./index.module.scss";

import React from "react";
import ReactDOM from "react-dom";

interface Input {
    type?:  "error" | "warning" | "info" | "default" | "successful";
    content?: string;
    theme?: "light" | "dark" | "colored";
    duration?: number | null;
}

const Portal = ( { className = "notification-portal", element = "div" } ) => {
    const Parent = document.getElementById("Application");

    const container = React.useRef(document.createElement(element));

    React.useEffect(() => {
        const $ = container.current;

        container.current.className = className;
        container.current.classList.add(Styles.component);

        Parent.appendChild(container.current);

        return () => {
            Parent.removeChild($);
        }
    }, [Parent, className]);

    return ReactDOM.createPortal(null, container.current);
};

const Component = ( input: Input = { type: "info", content: null, theme: "dark", duration: 3000 } ) => {
    const ID = React.useRef(null);

    React.useEffect(() => {
        // toast(content, {
        //     type: type,
        //     theme: theme,
        //     autoClose: ( duration <= 0 || duration === null ) ? false : duration
        // });

        // const dismiss = () => toast.dismiss(ID.current);

        // return () => toast.dismiss();
    }, [ ID ]);

    return (
        <Portal>
            {/* <ToastContainer transition={ Zoom } draggable={ false } autoClose={ duration } pauseOnFocusLoss={ false }/> */}
        </Portal>
    )
};

export { Component as Notification };

export default Component;
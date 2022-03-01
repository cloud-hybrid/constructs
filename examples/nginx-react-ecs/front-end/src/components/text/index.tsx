import "./index.scss";

import Styles from "./index.module.scss";

interface Parameters {
    /*** Component Display Text */
    input?: string;
    /*** Component Display Text Color (Theme) */
    theme?: "dark" | "light";
    /*** Component Display Text Alignment */
    center?: boolean;
}

const Component = ( input: Parameters = { input: "...", theme: "dark", center: false } ) => {
    const Theme = ( input.theme === "light" ) ? Styles.light : Styles.dark;

    return (
        <span className={ [ Styles.component, Theme, ( input.center ) ? Styles.center : null ].join(" ") }>
            {
                input.input
            }
        </span>
    )
};

export default Component;

export { Component as Text };
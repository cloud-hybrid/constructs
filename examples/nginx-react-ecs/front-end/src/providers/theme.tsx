import React from "react";

type Context = React.Context<{ Theme: string }>;

const Theme = ( theme = "dark" ) => {
    const $: Context = React.createContext({
        Theme: theme
    });

    return $;
};

export default Theme;

export { Theme };
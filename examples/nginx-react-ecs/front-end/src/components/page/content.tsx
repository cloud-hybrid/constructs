import React, { JSXElementConstructor, lazy as Split } from "react";

/*** Code Splitting Page Content + Data Fetching */
type $ = typeof import(".").Component;
type Import = React.LazyExoticComponent<$>;

/*** Split JSX Component */
const Template: Import = Split(() => import("."));

interface Properties {
    name: string;
    children: JSXElementConstructor<$>
}

const Content = ( properties: Properties ) => {
    return (
        <Template name={ properties.name }>
            {
                properties.children
            }
        </Template>
    )
};

export default Content;

export { Content };

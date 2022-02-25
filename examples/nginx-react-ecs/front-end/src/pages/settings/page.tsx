import Properties from "prop-types";

import React, { Suspense, lazy as Split } from "react";

type Import = React.LazyExoticComponent<typeof import("./../../components/page/content").default>;

/*** Code Splitting Page Content + Data Fetching */
const Content: Import = Split(() => import("./../../components/page/content"));

/**
 *  Page Exportable with Code-Split HTML Content
 *  and Asynchronous Data Fetching
 */

const Page = ( { name } ) => {
    return (
        <Suspense fallback={ null }>
            <Content name={ name }>
                {
                    name
                }
            </Content>
        </Suspense>
    )
};

Page.propTypes = {
    /*** Page Title */
    name: Properties.string
};

Page.defaultProps = {
    name: "Settings"
};

export default Page;

export { Page };
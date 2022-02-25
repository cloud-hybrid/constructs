import React, { Suspense, lazy as Split } from "react";

type Import = React.LazyExoticComponent<typeof import("./../../components/page/content").Content>;

const Content: Import = Split( () => import("./../../components/page/content") );

interface Properties {
    name?: string;
}

const Page = ( properties: Properties = { name: "home" } ) => {
    return (
        <Suspense fallback={ null }>
            <Content name={ properties.name }>
                {
                    properties.name
                }
            </Content>
        </Suspense>
    );
};

export default Page;

export { Page };

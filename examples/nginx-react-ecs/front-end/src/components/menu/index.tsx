import "./index.scss";

import { Navigator } from "./navigation";
import { Global } from "./title";
import { Item } from "./item";

const Component = () => {
    return (
        <Navigator>
            <Global prefix={ "Cloud" } title={ "Hybrid" }/>
            <Item title={ "Settings" }/>
        </Navigator>
    );
};

export default Component;

export { Component as Menu };

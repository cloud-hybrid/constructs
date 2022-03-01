import { Shell } from "./shell";

import { Route, Routes } from "react-router-dom";

import Home     from "./pages/home";
import Settings from "./pages/settings";

const Application = () => {
    return (
        <Routes>
            <Route path={ "*" } element={ <Shell/> }>
                <Route element={ ( <Home name={"Home"}/> ) } index/>
                <Route element={ ( <Settings name={"Settings"}/> ) } path={ "settings" }/>
            </Route>
        </Routes>

    );
};

export { Application };

export default Application;

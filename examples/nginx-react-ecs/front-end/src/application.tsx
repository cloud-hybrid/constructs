import { Shell } from "./shell";

import { Route, Routes } from "react-router-dom";

import Home     from "./pages/home";
import Settings from "./pages/settings";
import Mobile   from "./pages/mobile-preview";

const Application = () => {
    return (
        <Routes>
            <Route path={ "*" } element={ <Shell/> }>
                <Route element={ ( <Home name={"Home"}/> ) } index/>
                <Route element={ ( <Settings name={"Settings"}/> ) } path={ "settings" }/>
                <Route element={ ( <Mobile name={"Mobile"}/> ) } path={ "mobile-preview" }/>
            </Route>
        </Routes>

    );
};

export { Application };

export default Application;

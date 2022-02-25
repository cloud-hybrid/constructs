import Properties from "prop-types";

import { Outlet } from "react-router-dom";
import { Page }   from "./pages";

import { Menu }      from "./components/menu";
import { Container } from "./components/container";
import { Footer }    from "./components/footer";

const Shell = () => {
    return (
        <>
            <Menu/>
            <Container>
                <Page>
                    <Outlet/>
                </Page>
            </Container>
            <Footer/>
        </>
    );
};

Shell.propTypes = {};

Shell.defaultProps = {};

export default Shell;

export { Shell };
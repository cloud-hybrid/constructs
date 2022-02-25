import "./index.scss";

import Styles from "./index.module.scss";

import Properties from "prop-types";

const Component = ( { children } ) => {
    return (
        <section className={ "io-nexus-mobile-device-container" }>
            <div className="nexus-device iphone-x">
                <div className="notch">
                    <div className="camera"/>
                    <div className="speaker"/>
                </div>
                <div className="top-bar"/>
                <div className="sleep"/>
                <div className="bottom-bar"/>
                <div className="volume"/>
                <div className="overflow">
                    <div className="shadow shadow--tr"/>
                    <div className="shadow shadow--tl"/>
                    <div className="shadow shadow--br"/>
                    <div className="shadow shadow--bl"/>
                </div>
                <div className="inner-shadow"/>
                <div className="screen">
                    <section className="iphone-x inner-screen-grid">
                        {
                            // (<Loading active={!state[0]} small={true}/>)
                        }
                        {/*  ...  */ }
                        {
                            children
                        }
                        {/*  ...  */ }
                    </section>
                </div>
            </div>
        </section>
    );
};

Component.propTypes = {
    children: Properties.node
};

Component.defaultProps = {};

export { Component };

export default Component;
const Wait = async ( duration: number ) => {
    const $ = setTimeout[Object.getOwnPropertySymbols( setTimeout )[0]];

    return new Promise( ( resolve ) => {
        setTimeout(() => {
            (async () => await $(resolve(true)))();
        }, duration);
    } );
};

export { Wait };

export default Wait;
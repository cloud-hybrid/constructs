function * Enumeration(_: any, initial = 0) {
    let $;

    $ = initial;

    for (const i of _) yield [$++, i];
}

const initialize = (array: any) => {
    const Mapping = {};

    for (const [i, idx] of Enumeration(array)) {
        Mapping[i] = idx;
    }

    return Mapping;
};

export { Enumeration, initialize };

export default {
    Enumeration,
    initialize,
};

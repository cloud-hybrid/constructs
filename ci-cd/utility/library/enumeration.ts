function * Enumeration(_: Iterable<number>, initial = 0) {
    let $;

    $ = initial;

    for (const i of _) yield [$++, i];
}

const initialize = (array: Iterable<number>) => {
    const Mapping = {};

    for (const [i, idx] of Enumeration(array)) {
        /// @ts-ignore
        Mapping[i] = idx;
    }

    return Mapping;
};

export { Enumeration, initialize };

export default {
    Enumeration,
    initialize,
};

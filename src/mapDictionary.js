const Empty = '_';
const Tree = '🜍';
const Rock = '⊠';
const RiverRight = '⋙';
const RiverLeft = '⋘';
const Gravel = '░';
const Sand = '▒';
const Grass = ' ';

const Primitives = {
    Empty,
    Tree,
    Rock,
    RiverRight,
    RiverLeft,
    Gravel,
    Sand,
    Grass
};

export default {
    PrimitiveValues: Object.values(Primitives),
    PrimitiveNames: Object.keys(Primitives),
    Primitives,
    byFunction: {
        blocks: [Empty, Tree, Rock],
        slowsDown: [Gravel, Sand],
        swims: [RiverLeft, RiverRight],
        neutral: [Grass]
    }
}
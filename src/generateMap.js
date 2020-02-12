import mapDictionary from './mapDictionary.js';

const {
    PrimitiveValues,
    PrimitiveNames,
    Primitives
} = mapDictionary;

const seed = {
    [Primitives.Empty]: range(8, 10),
    [Primitives.Grass]: range(13, 15),
    [Primitives.Rock]: range(8, 10),
    [Primitives.Tree]: range(10, 12),
    [Primitives.RiverLeft]: range(10, 12),
    [Primitives.RiverRight]: range(10, 12),
    [Primitives.Gravel]: range(0, 1),
    [Primitives.Sand]: range(0, 1),
};
const pool = Object.entries(seed).flatMap(entry => {
    return Array(entry[1]).fill(entry[0]);
});

export default function ({ safePositions }) {
    const width = range(15, 20);
    const height = range(15, 20);

    const preRows = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push(any(pool));
        }
        preRows.push(row);
    }

    let rows = iterate(width, height, preRows);
    for (let i = 0; i < 3; i++) {
        rows = iterate(width, height, rows);
    }

    for (const position of safePositions) {
        const mapPosition = rows[position.y] && rows[position.y][position.x];
        if (mapPosition) {
            rows[position.y][position.x] = mapDictionary.Primitives.Grass;
        } else {
            console.error('Asked for a safe position outside the map boundaries!');
        }
    }

    return rows;
};

function iterate(width, height, preRows) {
    const rows = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            if (preRows[y][x] === Primitives.RiverRight || preRows[y][x] === Primitives.RiverLeft) {
                row.push(mostFrequent(neighbours(x, y, 10, 1, preRows)));
            } else {
                row.push(mostFrequent(neighbours(x, y, 1, 4, preRows)));
            }
        }
        rows.push(row);
    }

    return rows;
}

function neighbours(centerX, centerY, radiusX, radiusY, map) {
    const startY = Math.max(0, centerY - radiusY);
    const endY = Math.min(map.length - 1, centerY + radiusY);

    const startX = Math.max(0, centerX - radiusX);
    const endX = Math.max(map[0].length - 1, centerX + radiusX);

    const types = [];
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            const value = map[y] && map[y][x];
            if (value) {
                types.push(value);
            }
        }
    }

    return types;
}

function range(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}

function any(collection) {
    return collection[range(0, collection.length - 1)];
}

function mostFrequent(collection) {
    const frequencyMap = {};
    for (const value of collection) {
        if (value in frequencyMap) {
            frequencyMap[value] += 1;
        } else {
            frequencyMap[value] = 1;
        }
    }

    const [firstKey, ...keys] = Object.keys(frequencyMap);
    let maxKey = firstKey;
    let maxValue = frequencyMap[firstKey];
    for (const key of keys) {
        let frequencyOfKey = frequencyMap[key]
        if (frequencyOfKey > maxValue) {
            maxValue = frequencyMap;
            maxKey = key;
        }
    }

    return maxKey;
}
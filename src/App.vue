<template>
    <div id="app">
        <div class="grid">
            <div v-for="row in raster" class="row">
                <Tile v-for="column in row" :info="column"/>
            </div>
        </div>


        <input
                v-if="currentPlayer.scheme === 'arrows'"
                class="input"
                ref="playerInput"
                @keydown.left="move(-1, 0)"
                @keydown.right="move(1, 0)"
                @keydown.up="move(0, -1)"
                @keydown.down="move(0, 1)"/>
        <input
                v-else
                class="input"
                ref="playerInput"
                @keydown.a="move(-1, 0)"
                @keydown.d="move(1, 0)"
                @keydown.w="move(0, -1)"
                @keydown.s="move(0, 1)"
        />
    </div>
</template>
<script>
    import mapDictionary from './mapDictionary.js';
    import generateMap from './generateMap.js';
    import Tile from './components/Tile.vue';

    export default {
        data() {
            const characters = [
                { id: 'A', x: 4, y: 4, sign: 'O', level: 1 },
                { id: 'B', x: 0, y: 0, sign: 'X', level: 1 },
                { id: 'C', x: 1, y: 1, sign: 'M', level: 1 },
                { id: 'D', x: 3, y: 3, sign: 'N', level: 1 },
                { id: 'E', x: 2, y: 2, sign: 'Ö', level: 1 },
            ]
            const map = generateMap({ safePositions: characters.map(c => ({ x: c.x, y: c.y })) });

            return {
                map,
                characters,
                currentPlayerId: 'A',
                players: [
                    { id: 'A', scheme: 'arrows' },
                    { id: 'B', scheme: 'wasd' },
                ]
            }
        },
        computed: {
            currentPlayer() {
                return this.players.find(p => p.id === this.currentPlayerId);
            },
            raster() {
                return this.map.map((row, rowIndex) => {
                    return row.map((column, columnIndex) => {
                        if (column === mapDictionary.Primitives.Empty) {
                            return { sign: column, empty: true };
                        }
                        if (mapDictionary.byFunction.blocks.includes(column)) {
                            return {
                                blocks: true,
                                sign: column
                            };
                        }

                        const character = this.characters.find(c => c.x === columnIndex && c.y === rowIndex);
                        if (character) {
                            return {
                                sign: character.sign,
                                highlight: character.id === this.currentPlayerId,
                                level: character.level
                            };
                        }

                        return {
                            sign: column
                        };
                    });
                });
            }
        },
        methods: {
            move(xDirection, yDirection) {
                const player = this.players.find(p => p.id === this.currentPlayerId);
                const character = this.characters.find(c => c.id === player.id);
                const newX = character.x + xDirection;
                const newY = character.y + yDirection;

                let infoAtNewPosition = this.raster[newY] && this.raster[newY][newX];
                if (!infoAtNewPosition) return;
                if (mapDictionary.byFunction.blocks.includes(infoAtNewPosition.sign)) return;

                const characterAtLocationIndex = this.characters.findIndex(c => c.x === newX && c.y === newY);
                if (characterAtLocationIndex >= 0) {
                    character.level++;

                    const characterAtLocation = this.characters[characterAtLocationIndex];
                    this.characters.splice(characterAtLocationIndex, 1);
                    const playerForCharacterIndex = this.players.findIndex(p => p.id === characterAtLocation.id);
                    if (playerForCharacterIndex >= 0) {
                        this.players.splice(playerForCharacterIndex, 1);
                    }
                }

                character.x = newX;
                character.y = newY;
                this.nextPlayer();
            },
            nextPlayer() {
                const index = this.players.findIndex(p => p.id === this.currentPlayerId);

                let nextIndex;
                if (index === this.players.length - 1) {
                    nextIndex = 0;
                } else {
                    nextIndex = index + 1;
                }

                const nextPlayer = this.players[nextIndex];
                this.currentPlayerId = nextPlayer.id;
            },
            focusPlayerInput() {
                this.$refs.playerInput.focus();
            }
        },
        mounted() {
            this.focusPlayerInput();
        },
        components: {
            Tile
        }
    }
</script>
<style>
    body {
        background: #0A0A0A;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .grid {
        display: flex;
        flex-direction: column;
    }

    .row {
        display: flex;
    }

    .input {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 1px;
        border: none;
        background: transparent;
    }
</style>

<template>
    <div v-if="info.empty" class="emptyTile"/>
    <div v-else-if="info.block" class="tile">
        <div v-if="info.sign" class="tile-sign">{{ info.sign }}</div>
    </div>
    <div v-else :class="['tile', {'tile--highlighted': info.highlight }]">
        <div v-if="info.sign" class="tile-sign">{{ info.sign }}</div>
        <div v-if="info.level" class="tile-level">{{ info.level }}</div>
    </div>
</template>
<script>
    export default {
        props: {
            info: {
                default: () => ({ sign: '' })
            }
        }
    }
</script>
<style scoped>
    .emptyTile {
        width: 75px;
        height: 75px;
    }

    .tile {
        width: 75px;
        height: 75px;
        background: #002600;
        color: white;
        position: relative;
        outline: 1px solid green;
    }

    .tile--highlighted {
        background: #404000;
    }

    .tile-sign {
        font-size: 3.5em;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tile-level {
        font-size: 1.5em;
        position: absolute;
        bottom: 2px;
        right: 2px;
    }
</style>

<template>
    <div class="indicator-overlay-wrapper" v-if="value">
        <div class="overlay"></div>
        <div class="indicator-wrapper">
            <v-progress-circular
                :size="70"
                :width="7"
                color="white"
                indeterminate
            ></v-progress-circular>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'activity-overlay',
        props: {
            value: {
                default: false,
                required: true,
                type: Boolean
            }
        }
    };
</script>

<style scoped>
    .indicator-overlay-wrapper .overlay{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000000;
        opacity: 0.4;
        z-index: 99;
        pointer-events: bounding-box;
    }

    .indicator-overlay-wrapper .indicator-wrapper{
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -35px;
        margin-top: -35px;
        z-index: 100;
    }
</style>
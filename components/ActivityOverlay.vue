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

</style>
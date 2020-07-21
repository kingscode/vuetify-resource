<template>
    <div class="column type-checkbox">
        <v-icon v-if="isTrue()">$vuetify.icons.checkboxOn</v-icon>
    </div>
</template>

<script>
import {VIcon} from 'vuetify/lib';

export default {
    name: 'CheckboxType',
    components: {VIcon},
    props: ['content'],
    methods: {
        /**
         * Check if the prop: content is a true value
         */
        isTrue() {
            return !!(this.content || this.content === 'true' || this.content === '1');
        },
    },
};
</script>

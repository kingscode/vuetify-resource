<template>
    <div class="column type-checkbox">
        <v-icon>{{isTrue() ? $vuetify.icons.checkboxOn : ''}}</v-icon>
    </div>
</template>

<script>
    export default {
        name: 'Text',
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

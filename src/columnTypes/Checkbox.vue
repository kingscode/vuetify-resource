<template>
    <div class="column type-checkbox">
        <i class="material-icons icon icon--selection-control icon--checkbox">{{isTrue() ? 'check_circle' : ''}}</i>
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

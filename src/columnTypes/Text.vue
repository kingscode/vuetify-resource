<template>
    <div class="column type-text">
        <v-tooltip right v-if="typeof tableColumn.tooltip !== 'undefined'">
            <template v-slot:activator="{ on }">
                <span v-on="on">{{ content }}</span>
            </template>
            <span>{{item[tableColumn.tooltip]}}</span>
        </v-tooltip>

        <span v-else>{{ content }}</span>
    </div>
</template>

<script>
    export default {
        name: 'TextType',
        props: ['content', 'item', 'tableColumn'],

        data() {
            return {};
        },
    };
</script>

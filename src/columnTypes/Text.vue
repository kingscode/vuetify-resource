<template>
    <div class="column type-text">
        <v-tooltip right v-if="typeof tableColumn.tooltip !== 'undefined'">
            <template v-slot:activator="{ on }">
                <span v-on="on">{{ content }}</span>
            </template>
            <span v-html="item[tableColumn.tooltip]"></span>
        </v-tooltip>

        <span v-else>{{ content }}</span>
    </div>
</template>

<script>
import { VTooltip } from 'vuetify/lib';
    export default {
        name: 'TextType',
        props: ['content', 'item', 'tableColumn'],
        components: {
            VTooltip
        },
        data() {
            return {};
        },
    };
</script>

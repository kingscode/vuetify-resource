<template>
    <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
            <v-card-title class="headline">{{lang('delete-confirmation-title')}}</v-card-title>
            <v-card-text>{{lang('delete-confirmation-content')}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" flat @click="dialog = false">{{lang('cancel')}}</v-btn>
                <v-btn color="priamry darken-1" flat @click="handleDelete">{{lang('delete')}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Language from './../mixins/Language.js';

    export default {
        props: ['callback', 'texts'],
        name: 'delete-confirmation',
        mixins: [Language],
        data() {
            return {
                ids: [],
                dialog: false,
            }
        },
        methods: {
            handleDelete() {
                this.callback(this.ids);
                this.dialog=false;
            }
        }
    };
</script>

<style scoped>

</style>
<template>
    <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
            <v-card-title class="headline">{{lang('delete-confirmation-title')}}</v-card-title>
            <v-card-text>{{lang('delete-confirmation-content')}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" text @click="dialog = false">{{lang('cancel')}}</v-btn>
                <v-btn color="priamry darken-1" text @click="handleDelete" class="confirm-delete-button">
                    {{lang('delete')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Language from './../mixins/Language.js';
import {VBtn, VCard, VCardActions, VCardText, VCardTitle, VDialog, VSpacer} from 'vuetify/lib';

export default {
    props: ['callback', 'texts'],
    name: 'delete-confirmation',
    components: {VCard, VBtn, VSpacer, VCardActions, VCardTitle, VCardText, VDialog},
    mixins: [Language],
    data() {
        return {
            ids: [],
            dialog: false,
        };
    },
    methods: {
        handleDelete() {
            this.callback(this.ids);
            this.dialog = false;
        },
    },
};
</script>

<style scoped>

</style>

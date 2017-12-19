<template>
    <div class="vuetify-resource">
        <v-container fluid grid-list-lg>
            <v-dialog
                v-model="dialog.create"
                fullscreen
                transition="dialog-bottom-transition"
                :overlay=false
                scrollable
            >
                <v-card>
                    <v-toolbar style="flex: 0 0 auto;" dark class="primary">
                        <v-btn icon @click.native="dialog.create = false" dark>
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ meta.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark flat @click="createHandler()">Save</v-btn>
                            <slot name="createToolbar"></slot>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <slot name="createContent"></slot>
                    </v-card-text>
                    <div style="flex: 1 1 auto;"></div>
                </v-card>
            </v-dialog>

            <v-dialog
                v-model="dialog.update"
                fullscreen
                transition="dialog-bottom-transition"
                :overlay=false
                scrollable
            >
                <v-card>
                    <v-toolbar style="flex: 0 0 auto;" dark class="primary">
                        <v-btn icon @click.native="dialog.update = false" dark>
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ meta.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark flat @click="updateHandler()">Save</v-btn>
                            <slot name="updateToolbar"></slot>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <slot name="updateContent"></slot>
                    </v-card-text>
                    <div style="flex: 1 1 auto;"></div>
                </v-card>
            </v-dialog>

            <v-snackbar
                :timeout="2000"
                color="success"
                v-model="snackbar.active"
            >
                {{ snackbar.text }}
                <v-btn dark flat @click.native="snackbar.active = false">Sluiten</v-btn>
            </v-snackbar>

            <v-layout row wrap>
                <v-flex>

                    <v-speed-dial
                        absolute
                        v-model="fab"
                        :top="true"
                        :right="true"
                        :hover="true"
                        direction="bottom"
                        transition="slide-y-reverse-transition"
                    >
                        <v-btn slot="activator" color="blue darken-2" dark fab hover v-model="fab">
                            <v-icon>view_headline</v-icon>
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-tooltip left>
                            <v-btn
                                fab
                                dark
                                small
                                color="green"
                                v-if="canUpdate === true && selected.length === 1"
                                v-on:click="openUpdateHandler()"
                                slot="activator"
                            >
                                <v-icon>create</v-icon>
                            </v-btn>
                            <span>Bewerken</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <v-btn
                                fab
                                dark
                                small
                                color="indigo"
                                v-on:click="openCreateHandler()"
                                v-if="canAdd === true"
                                slot="activator"
                            >
                                <v-icon>add</v-icon>
                            </v-btn>
                            <span>Toevoegen</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <v-btn
                                fab
                                dark
                                small
                                color="red"
                                v-if="canDelete === true && selected.length >= 1"
                                v-on:click="deleteHandler()"
                                slot="activator"
                            >
                                <v-icon>delete</v-icon>
                            </v-btn>
                            <span>Verwijderen</span>
                        </v-tooltip>
                        <slot name="speedDailAfter"></slot>
                    </v-speed-dial>

                    <v-data-table
                        :headers="tableContent"
                        :items="items"
                        :search="search"
                        :pagination.sync="pagination"
                        v-model="selected"
                        item-key="id"
                        select-all
                        :total-items="totalItems"
                        :loading="loading"
                        class="elevation-1"
                        :rows-per-page-items="[10, 25, 100]"
                    >
                        <template slot="items" slot-scope="props">
                            <td>
                                <v-checkbox
                                    primary
                                    hide-details
                                    v-model="props.selected"
                                ></v-checkbox>
                            </td>
                            <td v-for="item in tableContent">
                                <component
                                    v-if="typeof item.columnType === 'object'"
                                    :is="item.columnType"
                                    :content="props.item[item.value]"
                                ></component>
                                <span v-if="typeof item.columnType !== 'object'">{{ props.item[item.value] }}</span>
                            </td>
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'ResourceList',
        data() {
            return {
                meta: {
                    name: 'Resource',
                    namePlural: 'Resources'
                },
                fab: false,
                search: '',
                totalItems: 0,
                items: [],
                loading: true,
                pagination: {},
                selected: [],
                dialog: {
                    create: false,
                    update: false
                },
                snackbar: {
                    text: 'hoi',
                    active: false
                },
                activity: {
                    isUpdating: false,
                    isDeleting: false,
                    isCreating: false
                }
            };
        },
        props: {
            /**
             * getDataCallBack
             *
             * @param pagination
             * @return promise with resolving items and total for the table
             */
            getDataCallback: {
                required: true,
                type: Function
            },

            /**
             * beforeCreateCallback
             * the callback wich is called before opening the create form
             */
            beforeCreateCallback: {
                required: false,
                type: Function
            },

            /**
             * createCallBack
             * the callback which is called when the create form is saved
             *
             * @return promise
             */
            createCallback: {
                required: true,
                type: Function
            },

            /**
             * beforeUpdateCallback
             * the callback which is called before the update dialog is opened
             */
            beforeUpdateCallback: {
                required: true,
                type: Function
            },

            /**
             * updateCallback
             * the callback wich is called when the update form is saved
             *
             * @return promise
             */
            updateCallback: {
                required: true,
                type: Function
            },

            /**
             * deleteCallback
             * the callback which is called when the delete action is called
             *
             * @return promise
             */
            deleteCallback: {
                required: true,
                type: Function
            },

            /**
             * @param array with object(s) for each column in the table
             *              {
             *                  text:       string              the text which is presented above the column
             *                  align:      string
             *                  sortable:   coolean
             *                  value:      string
             *                  columnType: object/component
             *              }
             */
            tableContent: {required: true, type: Array},
            canUpdate: {required: false, type: Boolean, default: true},
            canAdd: {required: false, type: Boolean, default: true},
            canDelete: {required: false, type: Boolean, default: true}
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataHandler();
                },
                deep: true
            }
        },
        methods: {
            /**
             * getDataHandler
             * calls the getDataCallback which is supposed to load all the items for the table
             * this callback needs to return a promise with resolving items and total
             *
             * @return void
             */
            getDataHandler() {
                this.loading = true;
                this.getDataCallback(this.pagination)
                    .then(data => {
                        this.clearSelected();
                        this.items = data.items;
                        this.totalItems = data.total;
                        this.loading = false;
                    });
            },

            /**
             * openCreateHandler
             * opens the create dialog and calls the beforeCreateCallback
             *
             * @return void
             */
            openCreateHandler() {
                this.beforeCreateCallback(this.selected);
                this.dialog.create = true;
            },

            /**
             * createHandler
             * Handles the save/create action calls the createCallback and handles the promise
             *
             * @return void
             */
            createHandler() {
                if (!this.activity.isCreating) {
                    this.activity.isCreating = true;
                    this.createCallback().then(() => {
                        this.activity.isCreating = false;
                        this.dialog.create = false;
                        this.showSnackbar('Het is opgeslagen');
                        this.getDataHandler();
                    }).catch(() => {
                        this.activity.isCreating = false;
                        this.showSnackbar('Het is mislukt', 'error');

                    });
                }
            },

            /**
             * openUpdateHandler
             * opens the update dialog and calls the beforeUpdateCallback
             *
             * @return void
             */
            openUpdateHandler() {
                this.beforeUpdateCallback(this.selected);
                this.dialog.update = true;
            },

            /**
             * updateHandler
             * Handles the save/update action calls the updateCallback and handles the promise
             *
             * @return void
             */
            updateHandler() {
                if (!this.activity.isUpdating) {
                    this.activity.isUpdating = true;
                    this.updateCallback(this.selected).then(() => {
                        this.activity.isUpdating = false;
                        this.dialog.update = false;
                        this.showSnackbar('Het is opgeslagen');
                        this.getDataHandler();
                    }).catch(() => {
                        this.activity.isUpdating = false;
                        this.showSnackbar('Het is mislukt', 'error');

                    });
                }
            },

            /**
             * deleteHandler
             * Handles the delete action and calls the deleteCallback and handles the promise
             *
             * @return void
             */
            deleteHandler() {
                if (!this.activity.isDeleting) {
                    this.activity.isDeleting = true;
                    this.deleteCallback(this.selected).then(() => {
                        this.activity.isDeleting = false;
                        this.showSnackbar('het is verwijderd');
                        this.getDataHandler();
                    }).catch(() => {
                        this.activity.isDeleting = false;
                        this.showSnackbar('Het is mislukt', 'error');

                    });
                }
            },

            /**
             * showSnackbar
             * an easy way to influence the snackbar
             *
             * @param content
             * @param color default: success
             *
             * @return void
             */
            showSnackbar(content, color = 'success') {
                this.snackbar.text = content;
                this.snackbar.active = true;
                this.snackbar.color = color;
            },

            /**
             * clearSelected
             * clear everything that is selected
             *
             * @return void
             */
            clearSelected() {
                this.selected = [];
            }
        },
        created() {
            this.getDataHandler();
        }
    };
</script>

<style>
    .vuetify-resource {
        position: relative;
        margin-top: 30px
    }

    .vuetify-resource th:first-child {
        width: 40px;
    }

    .vuetify-resource .speed-dial {
        right: -25px;
        top: 10px;
    }

    .vuetify-resource .datatable {
        width: 70vw;
    }
</style>

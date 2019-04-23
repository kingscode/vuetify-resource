<template>
    <div :class="resourceHtmlClass">
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
                            <v-icon>$vuetify.icons.close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ meta.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark flat @click="createHandler()">{{lang('save')}}</v-btn>
                            <slot name="createToolbar"></slot>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <slot name="createContent"></slot>
                        <activity-overlay v-model="activity.isCreating"/>
                    </v-card-text>
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
                            <v-icon>$vuetify.icons.close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ meta.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark flat @click="updateHandler()">{{lang('save')}}</v-btn>
                            <slot name="updateToolbar"></slot>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <slot name="updateContent"></slot>
                        <activity-overlay v-model="activity.isUpdating"/>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-snackbar
                :timeout="2000"
                :color="snackbar.color"
                v-model="snackbar.active"
            >
                {{ snackbar.text }}
                <v-btn dark flat @click.native="snackbar.active = false">{{lang('close')}}</v-btn>
            </v-snackbar>

            <v-layout row wrap>
                <v-fab-transition>
                    <v-speed-dial
                        v-model="fab"
                        :top="true"
                        :right="true"
                        :open-on-hover="true"
                        direction="bottom"
                        transition="slide-y-reverse-transition"
                        v-if="speedDailNotEmpty"
                    >
                        <v-btn slot="activator" color="accent" dark fab hover v-model="fab">
                            <v-icon>$vuetify.icons.menu</v-icon>
                            <v-icon>$vuetify.icons.close</v-icon>
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
                                <v-icon>$vuetify.icons.edit</v-icon>
                            </v-btn>
                            <span>{{ lang('update') }}</span>
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
                                <v-icon>$vuetify.icons.add</v-icon>
                            </v-btn>
                            <span>{{ lang('create') }}</span>
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
                                <v-icon>$vuetify.icons.delete</v-icon>
                            </v-btn>
                            <span>{{ lang('delete') }}</span>
                        </v-tooltip>
                        <slot name="speedDialAfter" :resources="selected"></slot>
                    </v-speed-dial>
                </v-fab-transition>
                <v-flex>
                    <v-layout row v-if="canSearch">
                        <v-flex xs10 sm4>
                            <v-text-field
                                v-model="search"
                                :append-icon="$vuetify.icons.search"
                                :label="lang('search')"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :pagination.sync="pagination"
                        v-model="selected"
                        item-key="id"
                        select-all
                        :total-items="totalItems"
                        :loading="loading"
                        class="elevation-1"
                        :rows-per-page-items="[10, 25, 100]"
                        v-on:input="onSelectedChange"
                        :rows-per-page-text="lang('rows-per-page-text')"
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
                            <td class="crud-actions">
                                <v-tooltip left v-if="canUpdate === true">
                                    <v-btn
                                        flat
                                        icon
                                        color="green"
                                        v-on:click="openUpdateHandler(props.item[resourceKeyName])"
                                        slot="activator"
                                    >
                                        <v-icon>$vuetify.icons.edit</v-icon>
                                    </v-btn>
                                    <span>{{ lang('update') }}</span>
                                </v-tooltip>
                                <v-tooltip left v-if="canDelete === true">
                                    <v-btn
                                        flat
                                        icon
                                        color="red"
                                        v-on:click="deleteHandler([props.item[resourceKeyName]])"
                                        slot="activator"
                                    >
                                        <v-icon>$vuetify.icons.delete</v-icon>
                                    </v-btn>
                                    <span>{{ lang('delete') }}</span>
                                </v-tooltip>
                                <slot name="crudActionsAfter" :resource="props.item"></slot>
                            </td>
                        </template>
                        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                            {{lang('from')}} {{ pageStart }} {{lang('till')}} {{ pageStop }}
                        </template>
                        <template slot="no-data">
                            {{lang('no-data')}}
                        </template>
                        <template slot="no-results">
                            {{lang('no-results')}}
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import texts from './texts.js';
    import ActivityOverlay from './components/ActivityOverlay.vue';

    export default {
        name: 'vuetify-resource',
        components: {ActivityOverlay},
        data() {
            return {
                fab: false,
                search: '',
                totalItems: 0,
                items: [],
                loading: true,
                pagination: {},
                selected: [],
                headers: [],
                dialog: {
                    create: false,
                    update: false,
                },
                snackbar: {
                    text: '',
                    active: false,
                    color: 'success',
                },
                activity: {
                    isUpdating: false,
                    isDeleting: false,
                    isCreating: false,
                },
                lastOpenedHash: null,
            };
        },
        computed: {
            resourceHtmlClass() {
                return {
                    'vuetify-resource': true,
                    'with-search': this.canSearch,
                };
            },
            speedDailNotEmpty() {
                if (this.canAdd || this.canUpdate || this.canDelete) {
                    return true;
                }

                if (typeof this.$scopedSlots.speedDialAfter !== 'undefined') {
                    if (typeof this.showSpeedDail !== 'undefined') {
                        return this.showSpeedDail;
                    }
                    return true;
                }
                return false;
            },
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
                type: Function,
            },

            /**
             * getItemCallback
             *
             * get the data of a single resource by the key (key is the id by default)
             *
             * @param key
             * @return promise with resolving the data of an resource
             */
            getItemCallback: {
                required: false,
                type: Function,
            },

            /**
             * beforeCreateCallback
             * the callback wich is called before opening the create form
             */
            beforeCreateCallback: {
                required: false,
                type: Function,
            },

            /**
             * createCallBack
             * the callback which is called when the create form is saved
             *
             * @return promise
             */
            createCallback: {
                required: false,
                type: Function,
            },

            /**
             * beforeUpdateCallback
             * the callback which is called before the update dialog is opened
             */
            beforeUpdateCallback: {
                required: false,
                type: Function,
            },

            /**
             * updateCallback
             * the callback wich is called when the update form is saved
             *
             * @return promise
             */
            updateCallback: {
                required: false,
                type: Function,
            },

            /**
             * deleteCallback
             * the callback which is called when the delete action is called
             *
             * @return promise
             */
            deleteCallback: {
                required: false,
                type: Function,
            },

            /**
             * useResourceKeyInUrl
             * Do you want the resource key (by default the resource's id) in the hash in the url?
             *
             * @return boolean
             */
            useResourceKeyInUrl: {
                required: false,
                type: Boolean,
                default: true,
            },

            /**
             * resourceKeyName
             * What is the name of the resource key? (default: id)
             * Notice: useResourceKeyInUrl must be true to use this property
             *
             * @return string
             */
            resourceKeyName: {
                required: false,
                type: String,
                default: 'id',
            },

            /**
             * getItemByCallback
             * find items by a callback (true) or from the items array (false)
             *
             * @return string
             */
            shouldGetItemByCallback: {
                required: false,
                type: Boolean,
                default: true,
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
            canDelete: {required: false, type: Boolean, default: true},
            canSearch: {required: false, type: Boolean, default: false},
            showSpeedDail: {required: false, type: Boolean},

            /**
             * texts
             *
             * @return Object with the texts you want to overrule
             * {
             *     save: 'Save',
             *     from: 'from',
             *     till: 'till',
             *     'no-data': 'There is nothing found',
             *     'no-results': 'There is nothing found for this filter',
             *     'rows-per-page-text': 'Rows per page'
             * }
             */
            texts: {
                required: false,
                type: Object,
            },

            meta: {
                required: false,
                type: Object,
                default: function () {
                    return {
                        name: 'Resource',
                        namePlural: 'Resources',
                    };
                },
            },
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataHandler();
                },
                deep: true,
            },
            selected: {
                handler() {
                    this.$emit('selected', this.selected);
                },
                deep: true,
            },
            $route: {
                handler() {
                    this.handleUrlChange();
                },
                deep: true,
            },
            search: {
                handler() {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        this.getDataHandler();
                    }, 400);
                },
                deep: true,
            },
        },
        created() {
            this.headers = JSON.parse(JSON.stringify(this.tableContent));
            this.headers.push({text: '', value: 'crud-actions', sortable: false});
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
                this.getDataCallback(this.pagination, this.search)
                    .then(data => {
                        this.clearSelected();
                        this.items = data.items;
                        this.totalItems = data.total;
                        this.loading = false;
                        this.handleUrlChange();
                    })

                    .catch((e) => {
                        if (process.env.NODE_ENV === 'development') {
                            console.error(e);
                        }
                        this.activity.isCreating = false;
                        this.showSnackbar('Er ging iets mis met het ophalen van de data', 'error');

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
                    this.createCallback()
                        .then(() => {
                            this.activity.isCreating = false;
                            this.dialog.create = false;
                            this.showSnackbar(this.lang('snackbar-saved'));
                            this.getDataHandler();
                        })

                        .catch((e) => {
                            if (process.env.NODE_ENV === 'development') {
                                console.error(e);
                            }
                            this.activity.isCreating = false;
                            this.showSnackbar(this.lang('snackbar-save-error'), 'error');

                        });
                }
            },

            /**
             * openUpdateHandler
             * opens the update dialog and calls the beforeUpdateCallback
             *
             * @return void
             */
            openUpdateHandler(resourceKey) {
                if (typeof resourceKey === 'undefined') {
                    resourceKey = this.selected[0][this.resourceKeyName];

                }
                this.setIndentificationKey(resourceKey);
                this.getItemByIdentificationKey(resourceKey, (item) => {
                    if (item === false) {
                        this.showSnackbar(this.lang('snackbar-get-error'), 'error');
                        return false;
                    } else {
                        this.lastOpenedHash = this.getIndentificationKey();
                        this.selected = [item];
                        this.onSelectedChange();
                        this.beforeUpdateCallback(this.selected);
                        this.dialog.update = true;
                    }
                });
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
                    this.updateCallback(this.selected)
                        .then(() => {
                            this.activity.isUpdating = false;
                            this.dialog.update = false;
                            this.showSnackbar(this.lang('snackbar-saved'));
                            this.getDataHandler();
                        })
                        .catch((e) => {
                            if (process.env.NODE_ENV === 'development') {
                                console.error(e);
                            }
                            this.activity.isUpdating = false;
                            this.showSnackbar(this.lang('snackbar-save-error'), 'error');

                        });
                }
            },

            /**
             * deleteHandler
             * Handles the delete action and calls the deleteCallback and handles the promise
             *
             * @return void
             */
            deleteHandler(ids) {
                if (typeof ids === 'undefined') {
                    ids = this.selected.map(item => item[this.resourceKeyName]);
                }
                if (!this.activity.isDeleting) {
                    this.activity.isDeleting = true;
                    this.deleteCallback(ids)
                        .then(() => {
                            this.activity.isDeleting = false;
                            this.showSnackbar(this.lang('snackbar-deleted'));
                            this.getDataHandler();
                        })
                        .catch((e) => {
                            if (process.env.NODE_ENV === 'development') {
                                console.error(e);
                            }
                            this.activity.isDeleting = false;
                            this.showSnackbar(this.lang('snackbar-delete-error'), 'error');

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
            },

            /**
             * setIdentificationKey
             * set the identification key to the hash of the url
             *
             * @param key
             */
            setIndentificationKey(key) {
                window.location.hash = '#' + key;
            },

            /**
             * getIdentificationKey
             * get the identification key from to the hash of the url
             *
             * @return key
             */
            getIndentificationKey() {

                return window.location.hash.substring(1);
            },

            /**
             * getItemByIdentificationKey
             *
             * call the getItemFromCallbackByIdentificationKey method or the getItemFromItemsByIdentificationKey method
             * the choise is made by the boolean property: shouldGetItemByCallback
             */
            getItemByIdentificationKey(key, callback) {
                if (this.shouldGetItemByCallback) {
                    this.getItemFromCallbackByIdentificationKey(key, callback);
                } else {
                    this.getItemFromItemsByIdentificationKey(key, callback);
                }
            },

            /**
             * getItemFromCallbackByIdentificationKey
             *
             * get the items from the api callback (getItemCallback) and call the callback
             */
            getItemFromCallbackByIdentificationKey(key, callback) {
                this.getItemCallback(key)
                    .then(data => {
                        callback(data.item);
                    })
                    .catch((e) => {
                        if (process.env.NODE_ENV === 'development') {
                            console.error(e);
                        }
                    });
            },

            /**
             * getItemFromItemsByIdentificationKey
             *
             * get the items from the this.selected and call the callback
             */
            getItemFromItemsByIdentificationKey(key, callback) {
                let returnItem = false;
                this.items.forEach((item) => {
                    if (item[this.resourceKeyName] === key) {
                        returnItem = item;
                        return;
                    }
                });
                callback(returnItem);
            },

            /**
             * handleUrlChange
             * get the items by the identificationkey (default the id)
             * the items will be recheived via the getItemByIdentificationKey method wich eather gets them from the
             * itemCallback or the selected array
             * and then open the update dialog
             */
            handleUrlChange() {
                if (this.getIndentificationKey() !== '') {
                    this.getItemByIdentificationKey(this.getIndentificationKey(), (item) => {
                        if (item === false) {
                            this.showSnackbar('Het is niet gelukt om een item te vinden.', 'error');
                            return false;
                        } else {
                            if (this.lastOpenedHash !== this.getIndentificationKey()) {
                                this.lastOpenedHash = this.getIndentificationKey();
                                this.selected = [item];
                                this.onSelectedChange();
                                this.beforeUpdateCallback(this.selected);
                                this.dialog.update = true;
                            }
                        }
                    });
                }
            },

            /**
             * onSelectedChange
             * When the selected in the vuetify table changes, emit the v-model
             */
            onSelectedChange() {
                this.$emit('input', this.selected);
            },

            lang(t) {
                if (typeof this.texts === 'undefined' || typeof this.texts[t] === 'undefined') {
                    return texts[t];
                } else {
                    return this.texts[t];
                }
            },
        },
    };
</script>
<style>
    .vuetify-resource
    {
        position: relative;
    }

    .vuetify-resource th:first-child
    {
        width: 40px;
    }

    td.crud-actions
    {
        float:       right;
        padding-top: 0px !important;
    }

    .vuetify-resource .v-speed-dial
    {
        position: absolute;
        top:      0px;
        right:    35px;
        z-index:  2;
    }

    .vuetify-resource.with-search .v-speed-dial
    {
        top:   55px;
        right: 35px;
    }

    @media only screen and (max-width: 599px)
    {
        .vuetify-resource.with-search .v-speed-dial
        {
            top: 65px;
        }

        .v-speed-dial
        {
            right: 0;
        }

        .vuetify-resource
        {
            margin-right: 0;
        }

        .datatable__actions__select
        {
            display: none;
        }

        .vuetify-resource th
        {
            display: none;
        }

        .vuetify-resource th:first-child, .vuetify-resource th:nth-child(2)
        {
            display: table-cell;
        }

        .vuetify-resource td
        {
            display: none;
        }

        .vuetify-resource td:first-child, .vuetify-resource td:nth-child(2)
        {
            display: table-cell;
        }
    }
</style>

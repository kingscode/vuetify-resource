<template>
  <div :class="resourceHtmlClass">
    <v-dialog
        v-model="dialog.create"
        fullscreen
        hide-overlay
        scrollable
        transition="dialog-bottom-transition"
    >
      <v-card v-if="dialog.create" class="dialog-create-card">
        <v-toolbar class="primary" dark style="flex: 0 0 auto;">
          <v-btn dark icon @click.native="dialog.create = false">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ meta.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <slot name="createToolbar">
              <v-btn dark text @click="createHandler()">{{ lang('save') }}</v-btn>
            </slot>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <slot name="createContent">
            <activity-overlay v-model="activity.isCreating"/>
          </slot>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialog.update"
        :overlay=false
        fullscreen
        scrollable
        transition="dialog-bottom-transition"
    >
      <v-card v-if="dialog.update" class="dialog-update-card">
        <v-toolbar class="primary" dark style="flex: 0 0 auto;">
          <v-btn class="close-button" dark icon @click.native="cancelUpdate">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ meta.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <slot name="updateToolbar">
              <v-btn class="save-button" dark text @click="updateHandler()">{{ lang('save') }}</v-btn>
            </slot>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <slot name="updateContent"></slot>
          <activity-overlay v-model="activity.isUpdating"/>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar
        v-model="snackbar.active"
        :color="snackbar.color"
        :timeout="2000"
    >
      {{ snackbar.text }}
      <v-btn dark text @click.native="snackbar.active = false">{{ lang('close') }}</v-btn>
    </v-snackbar>

    <v-layout>
      <v-fab-transition>
        <v-speed-dial
            v-if="speedDialNotEmpty"
            v-model="fab"
            :direction="speedDialDirection"
            :open-on-hover="true"
            :right="true"
            :top="true"
            transition="slide-y-reverse-transition"
        >
          <template v-slot:activator>
            <v-btn v-model="fab" color="accent" dark fab hover>
              <v-icon v-if="fab">$vuetify.icons.close</v-icon>
              <v-icon v-else>$vuetify.icons.menu</v-icon>
            </v-btn>
          </template>
          <v-tooltip left>
            <template v-slot:activator="{on}">
              <v-btn
                  v-if="canUpdateResources(selected) && selected.length === 1"
                  slot="activator"
                  v-on="on"
                  :color="speedDialColors.edit"
                  class="edit-button"
                  dark
                  fab
                  small
                  v-on:click="openUpdateHandler()"
              >
                <v-icon>{{ crudIcons.edit }}</v-icon>
              </v-btn>
            </template>
            <span>{{ lang('update') }}</span>
          </v-tooltip>

          <v-tooltip left>
            <template v-slot:activator="{on}">
              <v-btn
                  v-if="canAdd === true"
                  slot="activator"
                  v-on="on"
                  :color="speedDialColors.create"
                  class="add-button"
                  dark
                  fab
                  small
                  v-on:click="openCreateHandler()"
              >
                <v-icon>{{ crudIcons.create }}</v-icon>
              </v-btn>
            </template>
            <span>{{ lang('create') }}</span>
          </v-tooltip>

          <v-tooltip left>
            <template v-slot:activator="{on}">
              <v-btn
                  v-if="canDeleteResources(selected) && selected.length >= 1"
                  slot="activator"
                  v-on="on"
                  :color="speedDialColors.delete"
                  class="delete-button"
                  dark
                  fab
                  small
                  v-on:click="showDeleteConfirmation()"
              >
                <v-icon>{{ crudIcons.delete }}</v-icon>
              </v-btn>
            </template>
            <span>{{ lang('delete') }}</span>
          </v-tooltip>
          <slot :resources="selected" name="speedDialAfter"></slot>
        </v-speed-dial>
      </v-fab-transition>
      <v-flex>
        <v-layout v-if="canSearch" class="ma-0" row>
          <v-flex mb-3 sm4 xs10>
            <v-text-field
                v-model="search"
                :append-icon="$vuetify.icons.search"
                :label="lang('search')"
                hide-details
            ></v-text-field>
          </v-flex>
          <v-flex mb-3 sm8 xs2>
            <slot name="afterSearchBar"></slot>
          </v-flex>
        </v-layout>
        <v-data-table
            v-model="selected"
            :class="{'has-checkboxes': useCheckboxes}"
            :footer-props="{
                        itemsPerPageOptions: rowsPerPageItems
                    }"
            :headers="headers"
            :items="items"
            :loading="loading"
            :mobile-breakpoint="0"
            :options.sync="pagination"
            :server-items-length="totalItems"
            :show-select="useCheckboxes"
            class="elevation-1"
            item-key="id"
            v-bind="$attrs"
            v-on="$listeners"
            v-on:input="onSelectedChange"
        >
          <template v-slot:item="{ item, isSelected, select }">
            <tr @click="handleRowClick(item[resourceKeyName])" :class="item.itemClass">
              <td v-if="useCheckboxes">
                <v-checkbox
                    :input-value="isSelected"
                    class="ma-0"
                    hide-details
                    primary
                    @click.stop="select(!isSelected)"
                ></v-checkbox>
              </td>
              <td v-for="headerItem in tableContent">
                <component
                    :is="getColumnType(headerItem.columnType)"
                    :content="formatValue(headerItem, item[headerItem.value])"
                    :item="item"
                    :table-column="headerItem"
                ></component>
              </td>
              <td class="crud-actions text-right">
                <v-tooltip v-if="canUpdate" left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        :color="crudColors.edit"
                        :disabled="!canUpdateResources([item])"
                        class="edit-button"
                        icon
                        text
                        @click.stop="openUpdateHandler(item[resourceKeyName])"
                    >
                      <v-icon :size="crudIconSize">{{ crudIcons.edit }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ lang('update') }}</span>
                </v-tooltip>
                <v-tooltip v-if="canDelete" left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        :color="crudColors.delete"
                        :disabled="!canDeleteResources([item])"
                        class="delete-button"
                        icon
                        text
                        @click.stop="showDeleteConfirmation([item[resourceKeyName]])"
                    >
                      <v-icon :size="crudIconSize">{{ crudIcons.delete }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ lang('delete') }}</span>
                </v-tooltip>

                <slot :resource="item" name="crudActionsAfter"></slot>
              </td>
            </tr>
          </template>
          <template slot="footer.page-text" slot-scope="{ pageStart, pageStop, itemsLength }">
            {{ lang('from') }} {{ pageStart }} {{ lang('till') }} {{ pageStop }} {{ lang('of') }} {{ itemsLength }}
          </template>
          <template slot="no-data">
            {{ lang('no-data') }}
          </template>
          <template slot="loading">
            {{ lang('loading') }}
          </template>
          <template slot="no-results">
            {{ lang('no-results') }}
          </template>
          <template v-for="(_, name) in $slots" v-slot:[name]>
            <slot :name="name"/>
          </template>
          <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
            <slot :name="name" v-bind="slotData"/>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <delete-confirmation ref="deleteConfirmation" :callback="deleteHandler" :texts="texts"></delete-confirmation>
  </div>
</template>

<script>
import ActivityOverlay from './components/ActivityOverlay.vue';
import Text from './columnTypes/Text.vue';
import Checkbox from './columnTypes/Checkbox.vue';
import DeleteConfirmation from './components/DeleteConfirmation.vue';
import Language from './mixins/Language.js';
import {
  VBtn,
  VCard,
  VCardText,
  VCheckbox,
  VDataTable,
  VDialog,
  VFabTransition,
  VFlex,
  VIcon,
  VLayout,
  VSnackbar,
  VSpacer,
  VSpeedDial,
  VTextField,
  VToolbar,
  VToolbarItems,
  VToolbarTitle,
  VTooltip,
} from 'vuetify/lib';

let VuetifyResourceOptions = {
  style: {
    edit: {},
    drop: {},
    create: {},
  },
};

export default {
  /**
   * use
   *
   * @param options.style.edit
   * @param options.style.delete
   * @param options.style.create
   * @param options.style.default
   * @return Object with style-properties
   */
  use(options) {
    if (options && options.style) {
      VuetifyResourceOptions.style.edit = options.style.edit || {};
      VuetifyResourceOptions.style.drop = options.style.delete || {};
      VuetifyResourceOptions.style.create = options.style.create || {};
      VuetifyResourceOptions.style.default = options.style.default || null;
    }
  },
  name: 'vuetify-resource',
  components: {
    DeleteConfirmation,
    ActivityOverlay,
    /* Vuetify components: */
    VDialog,
    VCard,
    VToolbar,
    VBtn,
    VIcon,
    VFlex,
    VTextField,
    VSnackbar,
    VLayout,
    VFabTransition,
    VSpeedDial,
    VDataTable,
    VSpacer,
    VTooltip,
    VCheckbox,
    VCardText,
    VToolbarItems,
    VToolbarTitle,
  },
  mixins: [Language],
  data() {
    return {
      fab: false,
      search: '',
      totalItems: 0,
      items: [],
      loading: true,
      pagination: {
        itemsPerPage: this.rowsPerPage || 10,
      },
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
        'row-click': this.hasClickableRows,
      };
    },
    speedDialNotEmpty() {
      if (!this.showSpeedDial) {
        return false;
      }

      if (this.canAdd || this.canUpdate || this.canDelete) {
        return true;
      }

      return typeof this.$scopedSlots.speedDialAfter !== 'undefined';
    },
    colors() {
      const {
        style: {
          edit,
          create,
          drop,
        },
      } = VuetifyResourceOptions;
      const base = VuetifyResourceOptions.style.default;

      return {
        edit: edit.color || 'green',
        delete: drop.color || 'red',
        create: create.color || 'indigo',
        default: base && base.color != null ? base.color : null,
        onlyCrudActions: base && !base.onlySpeedDial,
        onlySpeedDial: base && !base.onlyCrudActions,
      };
    },
    crudColors() {
      return {
        edit: this.colors.onlyCrudActions && this.colors.default ? this.colors.default : this.colors.edit,
        delete: this.colors.onlyCrudActions && this.colors.default ? this.colors.default : this.colors.delete,
        create: this.colors.onlyCrudActions && this.colors.default ? this.colors.default : this.colors.create,
      };
    },
    speedDialColors() {
      return {
        edit: this.colors.onlySpeedDial && this.colors.default ? this.colors.default : this.colors.edit,
        delete: this.colors.onlySpeedDial && this.colors.default ? this.colors.default : this.colors.delete,
        create: this.colors.onlySpeedDial && this.colors.default ? this.colors.default : this.colors.create,
      };
    },
    crudIcons() {
      return {
        edit: VuetifyResourceOptions.style.edit.icon || '$vuetify.icons.edit',
        delete: VuetifyResourceOptions.style.drop.icon || '$vuetify.icons.delete',
        create: VuetifyResourceOptions.style.create.icon || '$vuetify.icons.add',
      };
    },
    crudIconSize: () => VuetifyResourceOptions.style.default ? VuetifyResourceOptions.style.default.size : null,
    hasClickableRows() {
      return 'row-click' in this.$listeners;
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
     *                  columnType: object/component or string
     *              }
     */
    tableContent: {
      required: true,
      type: Array,
    },
    canUpdate: {
      required: false,
      type: Boolean,
      default: true,
    },
    canUpdateResourceKey: {
      required: false,
      type: String,
      default: '',
    },
    canAdd: {
      required: false,
      type: Boolean,
      default: true,
    },
    canDelete: {
      required: false,
      type: Boolean,
      default: true,
    },
    canDeleteResourceKey: {
      required: false,
      type: String,
      default: '',
    },
    canSearch: {
      required: false,
      type: Boolean,
      default: false,
    },
    useCheckboxes: {
      required: false,
      type: Boolean,
      default: true,
    },
    showSpeedDial: {
      required: false,
      type: Boolean,
      default: true,
    },
    speedDialDirection: {
      required: false,
      type: String,
      default: 'left',
    },
    searchQuery: {
      type: String,
    },

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

    /**
     * rowsPerPageItems
     * The rows per page option selection
     *
     * @return array
     */
    rowsPerPageItems: {
      required: false,
      type: Array,
      default: () => {
        return [10, 25, 100];
      },
    },

    /**
     * rowsPerPage
     * The number of rows
     *
     * @return string
     */
    rowsPerPage: {
      required: false,
      type: Number,
      default: 10,
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
          this.pagination.page = 1;
          this.getDataHandler();
        }, 400);
      },
      deep: true,
    },
    searchQuery() {
      this.search = this.searchQuery;
    },
  },
  created() {
    this.headers = JSON.parse(JSON.stringify(this.tableContent));
    this.headers.push({
      text: '',
      value: 'crud-actions',
      sortable: false,
      class: 'crud-actions',
    });
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

          .catch(() => {
            this.activity.isCreating = false;
            this.showSnackbar(this.lang('snackbar-get-error'), 'error');
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

            .catch(() => {
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
          // deep clone so selected wont be triggered
          // @TODO on a new major version we should change this that this isn't an array
          this.beforeUpdateCallback([JSON.parse(JSON.stringify(item))]);
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
              history.pushState('', document.title, window.location.pathname + window.location.search);
              this.dialog.update = false;
              this.showSnackbar(this.lang('snackbar-saved'));
              this.getDataHandler();
            })
            .catch(() => {
              this.activity.isUpdating = false;
              this.showSnackbar(this.lang('snackbar-save-error'), 'error');

            });
      }
    },
    showDeleteConfirmation(ids) {
      if (typeof ids === 'undefined') {
        ids = this.selected.map(item => item[this.resourceKeyName]);
      }
      this.$refs.deleteConfirmation.ids = ids;
      this.$refs.deleteConfirmation.dialog = true;
    },
    /**
     * deleteHandler
     * Handles the delete action and calls the deleteCallback and handles the promise
     *
     * @return void
     */
    deleteHandler(ids) {
      if (!this.activity.isDeleting) {
        this.activity.isDeleting = true;
        this.deleteCallback(ids)
            .then(() => {
              this.activity.isDeleting = false;
              this.showSnackbar(this.lang('snackbar-deleted'));
              this.getDataHandler();
            })
            .catch(() => {
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
      if (this.useResourceKeyInUrl) {
        window.location.hash = '#' + key;
      }
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
            console.error(e);
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
      if (this.useResourceKeyInUrl && this.getIndentificationKey() !== '') {
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

    getColumnType(columnType) {
      if (typeof columnType === 'object') {
        return columnType;
      } else if (typeof columnType === 'string') {
        switch (columnType.toLowerCase()) {
          case 'checkbox':
            return Checkbox;
          default:
          case 'text':
            return Text;
        }
      }
      return Text;
    },

    /**
     * onSelectedChange
     * When the selected in the vuetify table changes, emit the v-model
     */
    onSelectedChange() {
      this.$emit('input', this.selected);
    },

    canDeleteResources(selected) {
      let canDelete = this.canDelete;
      if (this.canDeleteResourceKey !== '') {
        selected.forEach((resource) => {
          if (resource[this.canDeleteResourceKey] === false) {
            canDelete = false;
            return;
          }
        });
      }
      return canDelete;
    },

    canUpdateResources(selected) {
      let canUpdate = this.canUpdate;
      if (this.canUpdateResourceKey !== '') {
        selected.forEach((resource) => {
          if (resource[this.canUpdateResourceKey] === false) {
            canUpdate = false;
            return;
          }
        });
      }
      return canUpdate;
    },

    cancelUpdate() {
      history.pushState('', document.title, window.location.pathname + window.location.search);

      this.dialog.update = false;
    },

    handleRowClick(ResourceKey) {
      this.$emit('row-click', ResourceKey);
    },
    formatValue(headerItem, value) {
      if (typeof headerItem.formatter !== 'undefined') {
        return headerItem.formatter(value);
      }

      return value;
    },
  },
};
</script>
<style>
.vuetify-resource {
  position: relative;
}

.vuetify-resource .v-speed-dial {
  position: absolute;
  right:    5px;
  top:      -35px;
  z-index:  2;
}

.vuetify-resource.with-search .v-speed-dial {
  right: 5px;
  top:   15px;
}

.vuetify-resource .has-checkboxes th:first-child:not(.column) {
  width: 40px;
}

.vuetify-resource.row-click tr {
  cursor: pointer;
}

@media only screen and (max-width: 599px) {
  .vuetify-resource.with-search .v-speed-dial {
    top: 65px;
  }

  .v-speed-dial {
    right: 0;
  }

  .vuetify-resource {
    margin-right: 0;
  }

  .datatable__actions__select {
    display: none;
  }

  .vuetify-resource th {
    display: none;
  }

  .vuetify-resource th:first-child, .vuetify-resource .has-checkboxes th:nth-child(2), .vuetify-resource th.crud-actions {
    display: table-cell;
  }

  .vuetify-resource td {
    display: none;
  }

  .vuetify-resource td:first-child, .vuetify-resource .has-checkboxes td:nth-child(2), .vuetify-resource td.crud-actions {
    display: table-cell;
  }

  .vuetify-resource .v-data-footer__select {
    display: none;
  }
}
</style>

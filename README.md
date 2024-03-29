# Vuetify resource for vuetify 2 and vue 2 only

An easy way to create a resource or crud list with the vuetify data table.
With default a create, update and delete dialogs/actions and potential your own actions.
it can be used in CMS driven by vue/vuetify



## Project Install

``` bash
# npm
npm install @kingscode/vuetify-resource --save
```

## Global styling
A global option for styling the crudaction and speeddial buttons. 
When you import the VuetifyResource, you can set the style-options.
These are the options you can use as **default**:
- `color`, change color of button
- `size`, change only the size of the crudactions
- `onlyCrudActions`, set default styling for all crudactions
- `onlySpeedDial`, set default styling for all speeddial actions

The styling will default applies for crudactions and speeddials.

Example for changing styling of crudactions only:
```
VuetifyResource.use({
  style: {
    default: {
      color: '#222222',
      size: 18,
      onlyCrudActions: true,
    },
  },
});
```

You could also use property settings for changing the buttons individually. 
These are the options you can use as **individually**:
- `color`;
- `icon`.

Example for changing only the styling of the create-button:
```
VuetifyResource.use({
  style: {
    create: {
      color: '#1C87DB',
      icon: 'fa-calendar-plus',
    },
  },
});
```

## Slots

- createToolbar (you can add something before the save button, like other buttons, or an titlte)
- createContent (what's inside the create modal(your form))
- updateToolbar (you can add something before the save button, like other buttons, or an titlte)
- updateContent (what's inside the update modal(your form))
- speedDialAfter (you can add something after the default speed dail buttons create, update and delete.)
- crudActionsAfter (add an own crud action with a prop: `resource` which is the selected item)

example for crudActionsAfter slot:
```
<template slot="crudActionsAfter" slot-scope="slotProps">
    <v-tooltip left>
        <v-btn
            flat
            icon
            color="blue"
            slot="activator"
            @click="viewDocuments(slotProps.resource.id)"
        >
            <v-icon>fa-archive</v-icon>
        </v-btn>
        <span>view documents</span>
    </v-tooltip>
</template>
```
## Props
```
/**
 * getDataCallBack
 *
 *
 * @param pagination
 * @return promise with resolving items and total for the table
 */
```

```

/**
 * getItemCallback
 *
 * get the data of a single resource by the key (key is the id by default)
 *
 * @param key
 * @return promise with resolving the data of an resource
 */
```

```
/**
 * beforeCreateCallback
 * the callback wich is called before opening the create form
 */
```

```
/**
 * createCallBack
 * the callback which is called when the create form is saved
 *
 * @return promise
 */
```

```
/**
 * beforeUpdateCallback
 * the callback which is called before the update dialog is opened
 */

```

```
/**
 * updateCallback
 * the callback wich is called when the update form is saved
 *
 * @return promise
 */
```

```
/**
 * deleteCallback
 * the callback which is called when the delete action is called
 *
 * @return promise
 */
```

```
/**
 * useResourceKeyInUrl
 * Do you want the resource key (by default the resource's id) in the hash in the url?
 *
 * @return boolean
 */
```

```
/**
 * resourceKeyName
 * What is the name of the resource key? (default: id)
 * Notice: useResourceKeyInUrl must be true to use this property
 *
 * @return string
 */
```

```
/**
 * getItemByCallback
 * find items by a callback (true) or from the items array (false)
 *
 * @return string
 */
```
            
```
/**
 * tableContent
 * @param array with object(s) for each column in the table
 *     {
 *         text:       string              the text which is presented above the column
 *         align:      string
 *         sortable:   coolean
 *         value:      string
 *         columnType: object/component
 *         formatter: function             a function which returns a formatter value
 *     }
 */
``` 
     
```
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
```   
 
```
/**
 * meta
 *
 * @return Object with the meta you want to overrule
 * {
 *     name: 'Resource',
 *     namePlural: 'Resources'
 * }
 */
```

```
/**
 * rowsPerPageItems
 * The rows per page option selection
 *
 * @return array
 */
```

```
/**
 * rowsPerPage
 * The number of rows
 *
 * @return string
 */
```


```
canUpdate: {required: false, type: Boolean, default: true},
```
```
canUpdateResourceKey: {required: false, type: String, default: ''},
```
```
canAdd: {required: false, type: Boolean, default: true},
```
```
canDelete: {required: false, type: Boolean, default: true},
```
```
canDeleteResourceKey: {required: false, type: String, default: ''},
```
```
canSearch: {required: false, type: Boolean, default: false},
```
```
showSpeedDial: {required: false, type: Boolean, default: true},
```
```
speedDialDirection: {required: false, type: String}, //left, right, top, bottom
```
```
useCheckboxes: {required: false, type: Boolean},
```
```defaultSortBy {required: false, type: String}```
```defaultSortDesc {required: false, type: Boolean}```

## Events

selected

## functions

`reload` (`this.$refs.yourResource.reload()`) resets pagination and reloads it

## SPA example

``` javascript
<template>
    <vuetify-resource
        :getItemCallback="getItemFromApi"
        :getDataCallback="getDataFromApi"
        :tableContent="tableContent"
        :createCallback="createNews"
        :updateCallback="updateNews"
        :deleteCallback="deleteNews"
    >
        <div slot="createContent">
            place here your form
        </div>
        <div slot="updateContent">
            place here your form
        </div>
    </vuetify-resource>
</template>

<script>

import VuetfiyResource from '@kingscode/vuetify-resource';
import Text from '@kingscode/vuetify-resource/columnTypes/Text';
import Checkbox from '@kingscode/vuetify-resource/columnTypes/Checkbox';

export default {
    components: {
        VuetfiyResource,
    },
    name: 'News',
    data() {
        return {
            tableContent: [
                {
                    text: 'Titel',
                    align: 'left',
                    sortable: true,
                    value: 'title',
                },
            ],
            createForm: {values: {}},
            updateForm: {values: {}},
        };
    },
    methods: {
        /**
         * Get the data for the table from the API
         */
        getDataFromApi(pagination) {
            const {sortBy, descending, page, rowsPerPage} = pagination;
            return new Promise((resolve, reject) => {
                let items = [
                    {
                        title: 'hello'
                    },
                    {
                        title: 'hello2'
                    }
                ];
                resolve({
                    items,
                    items.length, //this is the servers total
                });

            });
        },
        /**
         * Get the data from one single resource, this is used for filling the forms
         */
        getItemFromApi(id) {
            return new Promise((resolve, reject) => {
                let item = [title: 'hallo'];
                resolve({
                    item
                });
            });
        },
        /**
         * Create an item on the server
         */
        createNews() {
            return new Promise((resolve, reject) => {
                resolve();
            });
        },
        /**
         * Update an item on the server
         */
        updateNews(selected) {
            return new Promise((resolve, reject) => {
                resolve();
            });

        },

        /**
         * Delete an item on the server
         */
        deleteNews(items) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        },
    },
};
</script>

```

## Extra information
- For debugging purposes when there is an error inside a callback, this will be outputted in a console.error if process.env.NODE_ENV === 'development'


# Vuetify resource

An easy way to create a resource or crud list with the vuetify data table.
With default a create, update and delete dialogs/actions and potential your own actions.
it can be used in CMS driven by vue/vuetify



## Project Install

``` bash
# npm
npm install @kingscode/vuetify-resource --save
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
canUpdate: {required: false, type: Boolean, default: true},
```
```
canAdd: {required: false, type: Boolean, default: true},
```
```
canDelete: {required: false, type: Boolean, default: true},
```
```
canSearch: {required: false, type: Boolean, default: false},
```
```
showSpeedDail: {required: false, type: Boolean},
```
```
useCheckboxes: {required: false, type: Boolean},
```

## Events

selected


## SPA example

``` javascript
<template>
    <v-app>
        <div class="page page-news">
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
            
        </div>
    </v-app>
</template>

<script>

    import ResourceList from '@kingscode/vuetify-resource';
    import Text from '@kingscode/vuetify-resource/columnTypes/Text';
    import Checkbox from '@kingscode/vuetify-resource/columnTypes/Checkbox';

    export default {
        components: {
            ResourceList,
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
                        columnType: Text,
                    },
                ],
                createForm: {values: {}},
                updateForm: {values: {}},
            };
        },
        methods: {
            /***
             * @param Pagination const {sortBy, descending, page, rowsPerPage} = this.pagination;
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
                    let total = 2;
                    resolve({
                        items,
                        total,
                    });

                });
            },
            getItemFromApi(id) {
                return new Promise((resolve, reject) => {
                    let item = [title: 'hallo'];
                    resolve({
                        item
                    });
                });
            },
            createNews() {
                return new Promise((resolve, reject) => {
                                resolve();
                });
            },
            updateNews(selected) {
                return new Promise((resolve, reject) => {
                    resolve();
                });

            },
            deleteNews(items) {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            },
        },
    };
</script>

<style scoped>

</style>

```

## Extra information
- For debugging purposes when there is an error inside a callback, this will be outputted in a console.error if process.env.NODE_ENV === 'development'


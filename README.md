# Vuetify resource

An easy way to create a resource list with the vuetify data table with default create  update and delete dialogs/actions and potential your own actions

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
- speedDailAfter (you can add something after the default speed dail buttons create, update and delete.)

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


## SPA example

``` javascript
<template>
    <v-app>
        <div class="page page-news">
            <resource-list
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
            </resource-list>
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


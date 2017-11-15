import ResourceList from './src/ResourceList.vue'

module.exports = {
    install: function (Vue, options) {
        Vue.component('resource-list', ResourceList);
    }
};
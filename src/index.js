import VuetifyResourceComponent from './VuetifyResource.vue';

const VuetifyResource = {
    install(Vue, options) {
        Vue.component('vuetify-resource', VuetifyResourceComponent);

    },
};

export default VuetifyResource;

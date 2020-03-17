import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VuetifyResourceComponent from './VuetifyResource.vue';

Vue.use(Vuetify);
const VuetifyResource = {
    install(Vue, options) {
        Vue.component('vuetify-resource', VuetifyResourceComponent);

    },
};

export default VuetifyResource;

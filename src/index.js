import Vue from 'vue'
import VuetifyResource from './VuetifyResource.vue'

export default {
    install(Vue, options) {
        Vue.component('vuetify-resource', VuetifyResource)
    }
}
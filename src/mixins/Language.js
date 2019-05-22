
import texts from './../texts.js';
export default {

    methods: {
        lang(t) {
            if (typeof this.texts === 'undefined' || typeof this.texts[t] === 'undefined') {
                return texts[t];
            } else {
                return this.texts[t];
            }
        },
    },
};
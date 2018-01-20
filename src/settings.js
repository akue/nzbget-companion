import Vue from 'vue';
import Vuelidate from 'vuelidate';
import ResourcePlugin from './utils/ResourcePlugin.js';

import Root from './settings/Root.vue';

/*------------------
  Vue Initialization
  ------------------*/

Vue.use(Vuelidate);
Vue.use(ResourcePlugin);

new Vue({
    el: '#app',
    render: h => h(Root)
});

// Prevents Firefox's bfcache from caching the page
window.onunload = () => { };
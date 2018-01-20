import Vue from 'vue';
import Vuex from 'vuex';
import { default as ResourcePlugin, iconsDirective } from './utils/ResourcePlugin.js';

import Root from './popup/Root.vue';
import store from './popup/store.js';

/*------------------
  Vue Initialization
  ------------------*/

Vue.use(Vuex);
Vue.use(ResourcePlugin);
Vue.directive('icons', iconsDirective);

new Vue({
	el: '#app',
	store: new Vuex.Store(store),
	render: h => h(Root)
});

// Prevents Firefox's bfcache from caching the page
window.onunload = () => { };

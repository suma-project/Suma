import Vue from 'vue'
import App from './App.vue'
import VueTippy from 'vue-tippy';
import SumaClient from './components/SumaClient.vue'
import VueRouter from 'vue-router'
import VModal from 'vue-js-modal'
import ToggleSwitch from 'vuejs-toggle-switch'

Vue.use(ToggleSwitch)
Vue.use(VModal)
Vue.use(VueRouter);

Vue.config.productionTip = false
Vue.use(VueTippy);

const routes = [
  { path: '/', component: SumaClient, 'name': 'index'},
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')


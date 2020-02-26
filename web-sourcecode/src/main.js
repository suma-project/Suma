import Vue from 'vue'
import App from './App.vue'
import VueTippy from 'vue-tippy';
import SumaClient from './components/SumaClient.vue'
import VueRouter from 'vue-router'

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


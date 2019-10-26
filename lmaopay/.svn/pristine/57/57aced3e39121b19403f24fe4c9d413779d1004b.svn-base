import Vue from 'vue'
import '../../assets/script/setRem.js'
import App from './App.vue'

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload,{
  loading:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXf398xY1lCAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
  error:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXf398xY1lCAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
  listenEvents:['scroll','wheel','mousewheel','resize','animationend','transitionend','touchmove'], //你想让vue监听的事件
})

import VueRouter from 'vue-router'

Vue.use(VueRouter);

import routes from './routes'

var router= new VueRouter({
    routes,
    linkActiveClass:'myClass'
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#box')

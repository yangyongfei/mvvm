import MVVM from './src/index'
import store from './src/plugin/store'
import router from './src/plugin/router'
//调用
import App from "./App.fly"
var vm = new MVVM({
  el: '#app',
  ...App,
  store,
  router
})  
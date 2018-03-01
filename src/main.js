// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//引入字体
import '@/assets/font/iconfont.css'
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import store from './store'

import { Button, RadioButton, RadioGroup, 
Autocomplete, Tabs, TabPane, Loading, Dialog, Form, FormItem, Input, Alert,
Dropdown, DropdownMenu, DropdownItem, Badge, Menu, MenuItem, Row, Col,
MenuItemGroup, Tooltip, checkbox, checkboxGroup, Notification, MessageBox
} from 'element-ui'
//
import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu)
//
Vue.config.productionTip = false
//
Vue.use(VueResource)
/*引入element-ui组件*/
Vue.use(Button)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Autocomplete)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Loading.directive)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Alert)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Badge)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(checkbox)
Vue.use(checkboxGroup)

Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm



/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})

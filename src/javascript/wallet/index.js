import Vue from 'vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import App from './components/app.vue'
import Navbar from './components/navbar.vue'
import Sidebar from './components/sidebar.vue'
import {store} from './store/store'
import BootstrapVue from 'bootstrap-vue'
import ElSearchTablePagination from 'el-search-table-pagination'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

require("jsappbase/vuebase.js")
Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(ElSearchTablePagination)
Vue.use(VueI18n)

const messages = {
  en: {
    el:{
      pagination:{
        goto: 'Go to',
        pagesize: '/page',
        total: 'Total {total}',
        pageClassifier: ''
      }
    }    
  },
  zh: {
    el:{
      pagination:{
        goto: '前往',
        pagesize: '条/页',
        total: '共 {total} 条',
        pageClassifier: '页'
      }
    }
  }
}
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

new Vue({
  el: "#app",
  components: {App, Navbar, Sidebar},
  store: store,
  data: {
    newActiveName: ''
  },
  methods: {
    openTab(name) {
      this.newActiveName = name
    },
    onTabChange(tabName) {
      this.newActiveName = tabName
    },
    changeLang() {
      Vue.config.lang = Vue.config.lang === 'zh-cn' ? 'en' : 'zh-cn';
    }

  },
  computed: {
    lang() {
      return Vue.config.lang;
    }
  }
})

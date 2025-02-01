import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import v8MenuTop from './components/v8/MenuTop.vue'

import TableToken from './components/TableToken.vue'
import TableGeneral from './components/TableGeneral.vue'
import CardsToken from './components/CardsToken.vue'


const app = createApp(App)
// app.use(bootstrap)
app.use(store)
app.use(router)

app.component('v8-menu-top', v8MenuTop)

app.component('TableGeneral', TableGeneral)
app.component('TableToken', TableToken)
app.component('CardsToken', CardsToken)

app.mount('#app')

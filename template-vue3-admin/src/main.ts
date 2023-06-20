import { createApp } from 'vue'
import pinia from './stores'
import router from './routers'
import setupIcons from './components/icon'
import App from './App.vue'
import '@/assets/fonts/font.css'
import './styles/element.scss'
import './styles/utils.scss'

const app = createApp(App)

setupIcons(app)

app
    .use(pinia)
    .use(router)
    .mount('#app')

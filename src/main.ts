import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

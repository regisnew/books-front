/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import { mask } from 'vue-the-mask'
import { VMoney } from 'v-money'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)
app.directive('mask', mask)
app.directive('money', VMoney)
app.mount('#app')

import { createI18n } from 'vue-i18n'
import messages from '@/locales'

const i18n = createI18n({
  locale: 'pt-BR',
  fallbbackLocale: 'pt-BR',
  // legacy: false,
  messages,
})

export default i18n

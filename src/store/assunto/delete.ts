import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { Assunto } from '@/types/assunto'

interface State {
  deleted?: Assunto;
  mercureDeleted?: Assunto;
  isLoading: boolean;
  error?: string;
}

export const useAssuntoDeleteStore = defineStore('assuntoDelete', {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem (item: Assunto) {
      this.setError('')
      this.toggleLoading()

      if (!item?.['@id']) {
        this.setError('No assunto found. Please reload')
        return
      }

      try {
        await api(item['@id'], { method: 'DELETE' })

        this.toggleLoading()
        this.setDeleted(item)
        this.setMercureDeleted(undefined)
      } catch (error) {
        this.toggleLoading()

        if (error instanceof Error) {
          this.setError(error.message)
        }
      }
    },

    toggleLoading () {
      this.isLoading = !this.isLoading
    },

    setDeleted (deleted: Assunto) {
      this.deleted = deleted
    },

    setMercureDeleted (mercureDeleted: Assunto | undefined) {
      this.mercureDeleted = mercureDeleted
    },

    setError (error: string) {
      this.error = error
    },
  },
})

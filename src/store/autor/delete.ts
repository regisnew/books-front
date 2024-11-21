import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { Autor } from '@/types/autor'

interface State {
  deleted?: Autor;
  mercureDeleted?: Autor;
  isLoading: boolean;
  error?: string;
}

export const useAutorDeleteStore = defineStore('autorDelete', {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem (item: Autor) {
      this.setError('')
      this.toggleLoading()

      if (!item?.['@id']) {
        this.setError('No autor found. Please reload')
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

    setDeleted (deleted: Autor) {
      this.deleted = deleted
    },

    setMercureDeleted (mercureDeleted: Autor | undefined) {
      this.mercureDeleted = mercureDeleted
    },

    setError (error: string) {
      this.error = error
    },
  },
})

import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { Livro } from '@/types/livro'

interface State {
  deleted?: Livro;
  mercureDeleted?: Livro;
  isLoading: boolean;
  error?: string;
}

export const useLivroDeleteStore = defineStore('livroDelete', {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem (item: Livro) {
      this.setError('')
      this.toggleLoading()

      if (!item?.['@id']) {
        this.setError('No livro found. Please reload')
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

    setDeleted (deleted: Livro) {
      this.deleted = deleted
    },

    setMercureDeleted (mercureDeleted: Livro | undefined) {
      this.mercureDeleted = mercureDeleted
    },

    setError (error: string) {
      this.error = error
    },
  },
})

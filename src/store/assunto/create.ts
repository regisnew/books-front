import { defineStore } from 'pinia'
import { SubmissionError } from '@/utils/error'
import api from '@/utils/api'
import type { Assunto } from '@/types/assunto'
import type { SubmissionErrors } from '@/types/error'

interface State {
  created?: Assunto;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useAssuntoCreateStore = defineStore('assuntoCreate', {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create (payload: Assunto) {
      this.setError(undefined)
      this.setViolations(undefined)
      this.toggleLoading()

      try {
        const response = await api('assuntos', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        const data: Assunto = await response.json()

        this.toggleLoading()
        this.setCreated(data)
      } catch (error) {
        this.toggleLoading()

        if (error instanceof SubmissionError) {
          this.setViolations(error.errors)
          this.setError(error.errors._error)
          return
        }

        if (error instanceof Error) {
          this.setError(error.message)
        }
      }
    },

    setCreated (created: Assunto) {
      this.created = created
    },

    toggleLoading () {
      this.isLoading = !this.isLoading
    },

    setError (error: string | undefined) {
      this.error = error
    },

    setViolations (violations: SubmissionErrors | undefined) {
      this.violations = violations
    },
  },
})

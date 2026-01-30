import { ref } from 'vue'

export function useApi<T = any>() {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const isSuccess = ref(false)

  const request = async (url: string, options: RequestInit = {}) => {
    loading.value = true
    error.value = null
    isSuccess.value = false

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
      }

      data.value = await response.json()
      isSuccess.value = true
    } catch (err: any) {
      error.value = err.message || 'Произошла ошибка'
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, isSuccess, request }
}

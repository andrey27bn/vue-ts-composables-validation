import { reactive, computed, watch } from 'vue'

export type ValidationRule = (value: any) => string | null

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule[]
}

export function useFormValidation<T extends Record<string, any>>(
  formData: T,
  schema: ValidationSchema<T>,
) {
  // Реактивное состояние ошибок для каждого поля
  const errors = reactive({} as Record<keyof T, string[]>)

  // Инициализация массивов ошибок
  for (const key in formData) {
    errors[key] = []
  }

  const validateField = (field: keyof T) => {
    const rules = schema[field]
    if (!rules) return

    const value = formData[field]
    errors[field] = rules
      .map((rule) => rule(value))
      .filter((result): result is string => result !== null)
  }

  const validateAll = () => {
    for (const key in schema) {
      validateField(key)
    }
    return isValid.value
  }

  // Общий статус валидности формы
  const isValid = computed(() =>
    Object.values(errors).every((errArray) => (errArray as string[]).length === 0),
  )

  // Следим за изменениями для мгновенной реакции
  watch(
    formData,
    () => {
      for (const key in schema) {
        validateField(key)
      }
    },
    { deep: true },
  )

  return { errors, isValid, validateAll, validateField }
}

// Готовые правила для экспорта
export const rules = {
  required:
    (msg = 'Обязательное поле') =>
    (v: any) =>
      v?.toString().trim() ? null : msg,
  email:
    (msg = 'Некорректный email') =>
    (v: any) =>
      /^\S+@\S+\.\S+$/.test(v) ? null : msg,
  minLength: (min: number, msg?: string) => (v: any) =>
    String(v).length >= min ? null : msg || `Минимум ${min} символов`,
}

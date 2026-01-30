<template>
  <div class="container">
    <h1>Регистрация</h1>
    
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label>Email:</label>
        <input v-model="form.email" type="text" :class="{ 'has-error': errors.email.length }" />
        <span class="error-text" v-if="errors.email[0]">{{ errors.email[0] }}</span>
      </div>

      <div class="field">
        <label>Пароль:</label>
        <input v-model="form.password" type="password" :class="{ 'has-error': errors.password.length }" />
        <span class="error-text" v-if="errors.password[0]">{{ errors.password[0] }}</span>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Зарегистрироваться' }}
      </button>

      <div v-if="isSuccess" class="success-banner">Данные успешно отправлены!</div>
      <div v-if="error" class="error-banner">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useFormValidation, rules } from './composables/useFormValidation';
import { useApi } from './composables/useApi';

// 1. Инициализация формы
const form = reactive({
  email: '',
  password: ''
});

// 2. Настройка валидации
const { errors, isValid, validateAll } = useFormValidation(form, {
  email: [rules.required(), rules.email()],
  password: [rules.required(), rules.minLength(6)]
});

// 3. Настройка API
const { loading, error, isSuccess, request } = useApi();

const handleSubmit = async () => {
  // Проверяем форму перед отправкой
  if (validateAll()) {
    await request('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(form)
    });
  }
};
</script>

<style scoped>
.container { max-width: 400px; margin: 50px auto; font-family: sans-serif; }
.field { margin-bottom: 20px; display: flex; flex-direction: column; }
input { padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; }
input.has-error { border-color: red; }
.error-text { color: red; font-size: 12px; margin-top: 4px; }
button { width: 100%; padding: 10px; cursor: pointer; background: #42b883; color: white; border: none; border-radius: 4px; }
button:disabled { background: #ccc; }
.success-banner { color: green; margin-top: 20px; text-align: center; }
.error-banner { color: red; margin-top: 20px; text-align: center; }
</style>
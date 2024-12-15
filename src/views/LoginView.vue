<script setup>
import { ref } from 'vue'
import { useAccountStore } from '../stores/AccountStore'
import { RouterLink } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import router from '../router/router'
import { useSocketStore } from '../stores/SocketStore'

const accountStore = useAccountStore()
const socketStore = useSocketStore()
const email = ref('')
const password = ref('')
const errorMessageEmail = ref('')
const errorMessagePassword = ref('')
const toast = useToast()

// Validate email
const validateEmail = (emailInput) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(emailInput)
  errorMessageEmail.value = isValid ? '' : 'Email không hợp lệ'
  return isValid
}

// Validate password at least password > 6 characters
const validatePassword = (password) => {
  const isValid = password.length > 0
  errorMessagePassword.value = isValid ? '' : 'Bạn chưa nhập mật khẩu'
  return isValid
}

const handleLogin = async () => {
  if (!validateEmail(email.value) && !validatePassword(password.value)) {
    return
  }

  try {
    const accountData = await accountStore.loginAccount(email.value, password.value)
    console.log('Login successful:', accountData)
    socketStore.connect()
    router.push('/')
  } catch (error) {
    console.log('error', error.message)
    toast.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra !',
      detail: `${error.message}`,
      life: 2000
    })
  }
}
</script>
<template>
  <div class="w-full">
    <div class="z-[-1] w-full h-[225px] fixed top-0 bg-[#00A884]"></div>
    <div class="z-[-1] w-full h-[calc(100vh-225px)] fixed bottom-0 bg-[#DBDDDC]"></div>

    <div class="max-w-xl mx-auto mt-16">
      <div class="z-10 p-20 mt-5 rounded-lg shadow-2xl bg-white">
        <div class="text-center text-3xl font-light pb-10 text-gray-700">Đăng nhập</div>
        <form
          class="flex flex-col space-y-4 pb-5"
          @submit.prevent="handleLogin"
          @keyup.enter="handleLogin"
        >
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required="true"
            placeholder="Nhập email"
            tabindex="1"
            class="w-full p-3 border rounded-md border-gray-300"
            v-model="email"
            @input="validateEmail(email)"
          />
          <p v-if="errorMessageEmail" class="text-red-500">{{ errorMessageEmail }}</p>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required="true"
            placeholder="Mật khẩu"
            tabindex="2"
            class="w-full p-3 border rounded-md border-gray-300"
            v-model="password"
            @input="validatePassword(password)"
          />
          <p v-if="errorMessagePassword" class="text-red-500">{{ errorMessagePassword }}</p>
        </form>
        <Toast />
        <button
          @click="handleLogin"
          type="submit"
          class="font-semibold w-full flex justify-center p-3 rounded-md bg-[#00A884] hover:bg-[#00bc93] text-white"
        >
          Đăng nhập
        </button>

        <div class="flex justify-center gap-2 my-2">
          <p class="text-gray-700">Không có tài khoản ?</p>
          <RouterLink
            to="/signup"
            href="#"
            class="text-[#00A884] hover:text-[#00bc93] font-semibold"
            >Đăng ký</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

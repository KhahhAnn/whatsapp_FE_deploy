<script setup>
import { ref } from 'vue'
import { useAccountStore } from '../stores/AccountStore'
import { RouterLink } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import router from '../router/router'
import { useSocketStore } from '../stores/SocketStore'

const accountStore = useAccountStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const socketStore = useSocketStore()
const errorMessage = ref('')
const toast = useToast()
const handleLogin = async () => {
  try {
    const accountData = await accountStore.loginAccount(
      email.value,
      password.value,
      rememberMe.value
    )
    if (accountData) {
      console.log('Login successful:', accountData)
      socketStore.connect()
      router.push('/')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Có lỗi xảy ra !',
        detail: 'Lỗi đăng nhập',
        life: 2000
      })
    }
  } catch (error) {
    console.log('error', error)
  }
}
</script>
<template>
  <div class="w-full">
    <div class="z-[-1] w-full h-[225px] fixed top-0 bg-[#00A884]"></div>
    <div class="z-[-1] w-full h-[calc(100vh-225px)] fixed bottom-0 bg-[#DBDDDC]"></div>

    <div class="max-w-xl mx-auto mt-16">
      <div class="z-10 p-20 mt-5 rounded-lg shadow-2xl bg-white">
        <div class="text-center text-3xl font-light pb-10 text-gray-700">
          Sign in to your account
        </div>
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
            placeholder="Email address"
            tabindex="1"
            class="w-full p-3 border rounded-md border-gray-300"
            @input="(event) => (email = event.target.value)"
          />
          <div class="flex justify-end items-center">
            <a href="#" class="font-semibold text-[#00A884] hover:text-[#00bc93]"
              >Forgot password?</a
            >
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required="true"
            placeholder="Password"
            tabindex="2"
            class="w-full p-3 border rounded-md border-gray-300"
            @input="(event) => (password = event.target.value)"
          />
          <div class="flex">
            <input type="checkbox" v-model="rememberMe" class="mr-2" />
            <label for="save-login" class="text-gray-700">Save login information</label>
          </div>
        </form>
        <Toast />
        <button
          @click="handleLogin"
          type="submit"
          class="font-semibold w-full flex justify-center p-3 rounded-md bg-[#00A884] hover:bg-[#00bc93] text-white"
        >
          Login
        </button>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        <div class="flex justify-center gap-2 my-2">
          <p class="text-gray-700">Don't have an account?</p>
          <RouterLink to="/signup" href="#" class="text-[#00A884] hover:text-[#00bc93]"
            >Sign up</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

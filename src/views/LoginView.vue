<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/AccountStore'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  console.log(email)
  errorMessage.value = ''
  try {
    const userData = await userStore.loginUser(email.value, password.value, rememberMe.value)
    if (userData) {
      console.log('Login successful:', userData)
      window.location.assign('/')
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.'
    console.log('error', error)
  }
}
</script>
<template>
  <div class="w-full">
    <div class="z-[-1] w-full h-[225px] fixed top-0 bg-[#00A884]"></div>
    <div class="z-[-1] w-full h-[calc(100vh-225px)] fixed bottom-0 bg-[#DBDDDC]"></div>

    <div class="max-w-xl mx-auto">
      <div class="mt-10 flex items-center w-full">
        <img width="40" src="../assets/whatsapp-logo.png" alt="" />
        <div class="font-semibold ml-3 text-gray-100">WHATSAPP WEB</div>
      </div>

      <div class="z-10 p-20 mt-5 rounded-lg shadow-2xl bg-white">
        <div class="text-center text-3xl font-light pb-10 text-gray-700">
          Sign in to your account
        </div>
        <form class="flex flex-col space-y-4 pb-5" @submit.prevent="handleLogin" @keyup.enter="handleLogin">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required="true"
            placeholder="Email address"
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
            class="w-full p-3 border rounded-md border-gray-300"
            @input="(event) => (password = event.target.value)"
          />
          <div class="flex">
            <input type="checkbox" v-model="rememberMe" class="mr-2" />
            <label for="save-login" class="text-gray-700">Save login information</label>
          </div>
        </form>
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

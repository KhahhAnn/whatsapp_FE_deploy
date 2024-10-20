<script setup>
import { ref } from 'vue'
import { useAccountStore } from '../stores/AccountStore'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const accountStore = useAccountStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const phoneNumber = ref('')
const errorMessage = ref('')
const toast = useToast();

const handleRegister = async () => {
  console.log(email)
  errorMessage.value = '' // Reset thông báo lỗi
  try {
    const accountData = await accountStore.registerAccount(
      username.value,
      email.value,
      password.value,
      phoneNumber.value
    )
    if (accountData) {
      // Chuyển hướng hoặc thực hiện hành động sau khi đăng nhập thành công
      console.log('register successful:', accountData)
      window.location.assign('/login')
    }
    else {
      toast.add({ severity: 'error', summary: 'Có lỗi xảy ra !', detail: 'Lỗi đăng ký', life: 2000 });
    }
  } catch (error) {
    errorMessage.value = 'register failed. Please try again.'
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
        <div class="text-center text-4xl font-light pb-10 text-gray-700">WhatsApp</div>
        <form class="flex flex-col space-y-4 pb-5" @submit.prevent="handleRegister" @keyup.enter="handleRegister">
          <input @input="(event) => (username = event.target.value)" type="text" placeholder="Username"
            class="w-full p-3 border rounded-md border-gray-300" />
          <input @input="(event) => (phoneNumber = event.target.value)" type="number" placeholder="Phone number"
            class="w-full p-3 border rounded-md border-gray-300" />
          <input @input="(event) => (email = event.target.value)" type="text" placeholder="Email address"
            class="w-full p-3 border rounded-md border-gray-300" />
          <input @input="(event) => (password = event.target.value)" type="password" placeholder="Password"
            class="w-full p-3 border rounded-md border-gray-300" />
          <input @input="(event) => (confirmPassword = event.target.value)" type="password"
            placeholder="Confirm password" class="w-full p-3 border rounded-md border-gray-300" />
          <div class="flex">
            <input type="checkbox" class="mr-2" />
            <label for="save-login" class="text-gray-700">I have read and agree to the terms of service</label>
          </div>
        </form>
        <Toast />
        <button class="w-full flex justify-center p-3 rounded-md bg-[#00A884] text-white" @click="handleRegister">
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>

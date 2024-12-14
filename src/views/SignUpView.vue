<script setup>
import { ref } from 'vue'
import { useAccountStore } from '../stores/AccountStore'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import router from '../router/router'


const accountStore = useAccountStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const phoneNumber = ref('')
const errorMessage = ref('')
const toast = useToast()

const errorMessageUsername = ref('')
const errorMessageEmail = ref('')
const errorMessagePhoneNumber = ref('')
const errorMessagePassword = ref('')
const errorMessageConfirmPassword = ref('')

const validateUsername = (username) => {
  const isValid = username.length > 0
  errorMessageUsername.value = isValid ? '' : 'Bạn chưa nhập tên đăng nhập'
  return isValid
}

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10,}$/
  const isValid = phoneRegex.test(phoneNumber)
  errorMessagePhoneNumber.value = isValid ? '' : 'Số điện thoại không hợp lệ'
  return isValid
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  errorMessageEmail.value = isValid ? '' : 'Email không hợp lệ'
  return isValid
}

const validatePassword = (password) => {
  const isValid = password.length > 0
  errorMessagePassword.value = isValid ? '' : 'Bạn chưa nhập mật khẩu'
  return isValid
}

const validateConfirmPassword = (password, confirmPassword) => {
  const isValid = password === confirmPassword
  errorMessageConfirmPassword.value = isValid ? '' : 'Mật khẩu không khớp'
  return isValid
}

const handleRegister = async () => {
  if (
    !validateUsername(username.value) ||
    !validatePhoneNumber(phoneNumber.value) ||
    !validateEmail(email.value) ||
    !validatePassword(password.value) ||
    !validateConfirmPassword(password.value, confirmPassword.value)
  ) {
    return
  }

  try {
    const accountData = await accountStore.registerAccount(
      username.value,
      email.value,
      password.value,
      phoneNumber.value
    )
    if (accountData) {
      console.log('register successful:', accountData)
      toast.add({
        severity: 'success',
        summary: 'Đăng ký thành công !',
        life: 2000
      })
      router.push('/login')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Có lỗi xảy ra !',
        detail: 'Lỗi đăng ký',
        life: 2000
      })
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

    <div class="max-w-xl mx-auto mt-16">
      <div class="z-10 p-20 mt-5 rounded-lg shadow-2xl bg-white">
        <div class="text-center text-4xl font-light pb-10 text-gray-700">Đăng ký tài khoản</div>
        <form
          class="flex flex-col space-y-4 pb-5"
          @submit.prevent="handleRegister"
          @keyup.enter="handleRegister"
        >
          <!-- Username -->
          <input
            v-model="username"
            @input="validateUsername(username)"
            type="text"
            placeholder="Tên đăng nhập"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <p v-if="errorMessageUsername" class="text-red-500">{{ errorMessageUsername }}</p>
          <!-- phoneNumber -->
          <input
            v-model="phoneNumber"
            @input="validatePhoneNumber(phoneNumber)"
            type="string"
            placeholder="Số điện thoại"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <p v-if="errorMessagePhoneNumber" class="text-red-500">{{ errorMessagePhoneNumber }}</p>
          <!-- Email -->
          <input
            v-model="email"
            @input="validateEmail(email)"
            type="text"
            placeholder="Email"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <p v-if="errorMessageEmail" class="text-red-500">{{ errorMessageEmail }}</p>
          <!-- Password -->
          <input
            v-model="password"
            @input="validatePassword(password)"
            type="password"
            placeholder="Mật khẩu"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <p v-if="errorMessagePassword" class="text-red-500">{{ errorMessagePassword }}</p>
          <!-- confirmPassword -->
          <input
            v-model="confirmPassword"
            @input="validateConfirmPassword(password, confirmPassword)"
            type="password"
            placeholder="Xác nhận mật khẩu"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <p v-if="errorMessageConfirmPassword" class="text-red-500">
            {{ errorMessageConfirmPassword }}
          </p>
        </form>
        <button
          class="w-full flex justify-center p-3 rounded-md bg-[#00A884] text-white"
          @click="handleRegister"
        >
          Đăng ký
        </button>
        <div class="flex justify-center gap-2 my-2">
          <p class="text-gray-700">Đã có tài khoản ?</p>
          <RouterLink to="/login" href="#" class="text-[#00A884] hover:text-[#00bc93] font-semibold"
            >Đăng nhập</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
  <Teleport to="#app">
    <Toast />
  </Teleport>
</template>

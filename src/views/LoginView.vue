<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="w-full">
    <div class="bg-[#00A884] z-[-1] w-full h-[225px] fixed top-0"></div>
    <div class="bg-[#DBDDDC] z-[-1] w-full h-[calc(100vh-225px)] fixed bottom-0"></div>

    <div class="max-w-xl mx-auto">
      <div class="mt-10 flex items-center w-full">
        <img width="40" src="../assets/whatsapp-logo.png" alt="" />
        <div class="font-semibold text-gray-100 ml-3">WHATSAPP WEB</div>
      </div>

      <div class="bg-white z-10 p-20 mt-5 rounded-lg shadow-2xl">
        <div class="text-center text-4xl text-gray-700 font-light pb-10">WhatsApp</div>
        <div class="flex flex-col space-y-4 pb-5">
          <input
            type="text"
            placeholder="Email address"
            class="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            class="w-full p-3 border border-gray-300 rounded-md"
          />
          <div class="flex">
            <input type="checkbox" class="mr-2" />
            <label for="save-login" class="text-gray-700">Save login information</label>
          </div>
        </div>
        <button class="w-full flex justify-center bg-[#00A884] text-white p-3 rounded-md">
          Login
        </button>
        <div class="flex justify-center gap-2 my-2">
          <p class="text-gray-700">Don't have an account?</p>
          <RouterLink to="/signup" href="#" class="text-[#00A884]">Sign up</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

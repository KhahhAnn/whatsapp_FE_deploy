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
        <div class="flex flex-col space-y-4 pb-5">
          <input
            type="text"
            placeholder="Username"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <input
            type="text"
            placeholder="Email address"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <input
            type="password"
            placeholder="Confirm password"
            class="w-full p-3 border rounded-md border-gray-300"
          />
          <div class="flex">
            <input type="checkbox" class="mr-2" />
            <label for="save-login" class="text-gray-700"
              >I have read and agree to the terms of service</label
            >
          </div>
        </div>
        <button class="w-full flex justify-center p-3 rounded-md bg-[#00A884] text-white">
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>

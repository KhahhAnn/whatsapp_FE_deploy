<script setup></script>

<template>
  <div class="flex flex-col justify-between bg-[#FAF3E9] w-3/4 rounded-3xl shadow-2xl">
    <div class="flex justify-between items-center p-4 border-b-2 border-black">
      <div class="flex items-center gap-4">
        <img class="w-14 h-14 rounded-full object-cover" src="../assets/avt.png" />
        <div class="user-data">
          <h1>Nguyễn Văn A</h1>
          <p>Đang hoạt động</p>
        </div>
      </div>
      <div class="flex gap-4">
        <font-awesome-icon
          class="hover:bg-[#c0bab1] p-2 rounded-full"
          :icon="['fas', 'phone']"
          size="lg"
        />
        <font-awesome-icon
          class="hover:bg-[#c0bab1] p-2 rounded-full"
          :icon="['fas', 'video']"
          size="lg"
        />
        <font-awesome-icon
          class="hover:bg-[#c0bab1] p-2 rounded-full"
          :icon="['fas', 'ellipsis']"
        />
      </div>
    </div>
    <div class="grow overflow-auto max-h-[82vh]">
      <div>Block</div>
    </div>
    <div class="flex justify-center items-center gap-2 px-4 py-2 border-t-2 border-black">
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'circle-plus']"
        size="lg"
      />
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'image']"
        size="lg"
      />
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'note-sticky']"
        size="lg"
      />
      <input
        type="text"
        class="w-full py-2 px-4 rounded-full bg-gray-300 focus:bg-white focus:outline-none"
        placeholder="Send message"
      />
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'paper-plane']"
        size="lg"
      />
    </div>
  </div>
</template>

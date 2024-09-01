import { defineStore } from 'pinia'
import { ref } from 'vue'

const readFromLocalStorage = () => {}

const writeToLocalStorage = () => {}

export const useTheme = defineStore('theme', () => {
  const theme = ref(readFromLocalStorage())

  function setTheme(newTheme) {
    theme.value = newTheme
    writeToLocalStorage(newTheme)
  }
  //reactive
  return {
    theme,
    setTheme
  }
})

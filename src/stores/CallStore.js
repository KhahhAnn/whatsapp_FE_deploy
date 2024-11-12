// store.js
import { defineStore } from 'pinia';

export const useCallStore = defineStore('call', {
  state: () => ({
    incomingCall: null,
  }),
  actions: {
    setIncomingCall(call) {
      this.incomingCall = call;
    },
  },
});
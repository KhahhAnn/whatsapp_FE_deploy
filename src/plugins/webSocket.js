import { ref, readonly } from 'vue';

export default {
  install: (app, { url }) => {
    const connection = new WebSocket(url);
    const receivedMessages = ref([]);

    connection.onopen = () => {
      console.log('Connected to WebSocket server:', url);
    };

    connection.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    connection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    connection.onmessage = (event) => {
      console.log('Message received:', event.data);
      const message = JSON.parse(event.data);
      receivedMessages.value.push(message);
    };

    app.config.globalProperties.$socket = {
      sendMessage: (data) => {
        if (connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify(data));
        }
      },
    };

    app.provide('receivedMessages', readonly(receivedMessages));
    app.provide('sendMessage', (data) => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify(data));
      }
    });
  }
}
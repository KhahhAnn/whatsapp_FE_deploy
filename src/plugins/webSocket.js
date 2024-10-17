export default {
  install: (app, { url }) => {
    const connection = new WebSocket(url)

    connection.onopen = () => {
      console.log('Connected to WebSocket server:', url)
    }

    connection.onclose = () => {
      console.log('Disconnected from WebSocket server')
    }

    connection.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Cung cấp cho toàn bộ ứng dụng
    app.config.globalProperties.$socket = connection

    // Các phương thức để gửi/ nhận dữ liệu
    app.config.globalProperties.$sendMessage = (data) => {
      connection.send(JSON.stringify(data))
    }
  }
}

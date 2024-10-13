export default {
    install: (app, { url }) => {
      const connection = new WebSocket(url);
  
      connection.onopen = () => {
        console.log('Connected to WebSocket server:', url);
      };
  
      connection.onclose = () => {
        console.log('Disconnected from WebSocket server');
        // Để tái kết nối tự động, bạn có thể dùng setInterval hoặc cơ chế khác ở đây
      };
  
      connection.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      // Cung cấp cho toàn bộ ứng dụng
      app.config.globalProperties.$socket = connection;
      
      // Tuỳ chỉnh: Cung cấp thêm các phương thức để gửi/ nhận dữ liệu
      app.config.globalProperties.$sendMessage = (data) => {
        connection.send(JSON.stringify(data));
      };
    }
  };
  
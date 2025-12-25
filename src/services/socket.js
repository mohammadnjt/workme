import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (ip = '', setSocketConnected) => {
  // اگر سوکت از قبل وجود دارد و متصل است، برگردان
  if (socket && socket.connected) {
    return socket;
  }

  // اگر سوکت قدیمی وجود دارد اما قطع شده، آن را پاک کن
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // ایجاد سوکت جدید
  socket = io('http://localhost:9000', {
    auth: {
      secret: localStorage.getItem('secret'),
      ip
    },
    autoConnect: true
  });

  socket.on('connect', () => {
    console.log('connected to socket.io', socket);
    socket.emit('user-init')
    if(setSocketConnected)
    setSocketConnected(socket);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

// تابع برای دریافت instance فعلی سوکت
export const getSocket = () => {
  return socket;
};

// تابع برای قطع اتصال
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
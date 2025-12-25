// App.js
import { useEffect } from "react";
import AppRouter from "./router/App.route";
import { useAppStore } from "./stores/useAppStore";
import { connectSocket } from "./services/socket";
import useUserIP from "./hooks/useUserIP";

export default function App() {
  const { auth, setSocketConnected, setTradeSettings, setWallets } = useAppStore();
  const { ip } = useUserIP();

  // console.log('auth', auth);
  useEffect(() => {
    if (auth.isAuthenticated && ip) {
      // استفاده از هوک اتصال Socket
      const socket = connectSocket(ip, setSocketConnected);

      socket.on("user-ready", (data) => setTradeSettings(data));
      socket.on("user-wallets", (data) => {
        setWallets(data)
      });
    }
  }, [auth.isAuthenticated, ip, setSocketConnected, setTradeSettings, setWallets])


  return (
    <div>
      <AppRouter />
    </div>
  );
}
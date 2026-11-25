import { useEffect, useState } from 'react';

export function useWebSocket(url = 'ws://localhost:5000') {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Mock WebSocket connection wrapper for development safely
    const mockWs = {
      send: (data) => console.log('Mock WS Sent:', data),
      close: () => {}
    };
    setSocket(mockWs);
    setIsConnected(true);

    return () => {
      setIsConnected(false);
    };
  }, [url]);

  return { socket, messages, isConnected };
}
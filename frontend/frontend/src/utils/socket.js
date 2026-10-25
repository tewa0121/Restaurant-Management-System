// Mock WebSocket connection utility for development and local persistence

class MockSocketManager {
  constructor(url = 'ws://localhost:5000') {
    this.url = url;
    this.listeners = new Map();
    this.isConnected = true;
    console.log(`🔌 [MockSocket] Connected to ${this.url}`);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const arr = this.listeners.get(event);
    const index = arr.indexOf(callback);
    if (index > -1) arr.splice(index, 1);
  }

  emit(event, data) {
    console.log(`📤 [MockSocket Emit] Event: ${event}`, data);
    // Simulate broadcast/echo back if needed
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  disconnect() {
    this.isConnected = false;
    console.log('🔌 [MockSocket] Disconnected');
  }
}

// Export a singleton instance across the frontend
export const socket = new MockSocketManager();
export default socket;
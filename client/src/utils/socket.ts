import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://192.168.1.100:4000' : 'https://localhost:4000';

export const socket = io(URL);

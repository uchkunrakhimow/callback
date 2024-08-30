import { io } from 'socket.io-client';

const URL = window.location.href;

export const socket = io(URL, {
  transports: ['websocket'],
});

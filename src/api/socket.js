import io from 'socket.io-client';
import { socketURL } from './config';

const socket = io.connect(socketURL);

export default socket;

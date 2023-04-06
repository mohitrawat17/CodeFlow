import {io} from 'socket.io-client';


export const initSocket=async () =>{
    const options={
        transports: ['websocket'],
        timeout:10000,
        reconnectionAttempt:'Infinity',
        'force new connection':true,
    }
    return io(process.env.REACT_APP_BACKEND_URL,options)
}
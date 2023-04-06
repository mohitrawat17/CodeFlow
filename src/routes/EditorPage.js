import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import '../../src/editor.css'
import Client from '../components/Client'
import MainEditor from '../components/MainEditor'
import { initSocket } from '../socket'
import ACTIONS from '../Actions'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const EditorPage = () => {
   
  const [clients,setClients]=useState([
    
   ])

 const reactNavigator=useNavigate();
  const socketRef=useRef(null);
  const location=useLocation();
 const {editorId}=useParams();


  useEffect(()=>{
    const init=async ()=>{
      socketRef.current=await initSocket();

      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));  
      
      function handleErrors(e){
        console.log('socket error',e);
        toast.error('socket connection failed,try again later !');
        reactNavigator('/');
      }


      socketRef.current.emit(ACTIONS.JOIN,{
        editorId,
        username:location.state?.userName,

      });

      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
              if(username!==location.state?.username){
                toast.success(`${username} joined`);
                console.log(`${username} joined`);
              }
              setClients(clients);
      })


      //disconnection
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left.`);
        setClients((prev)=>{
          return prev.filter((c)=>c.socketId!==socketId);
        });
      })
    };
    init();
    return ()=>{
      
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
      socketRef.current=null;
    }
  },[]);


if(!location.state){
 return <Navigate to="/"/>
}





  

  return (
    <>
      <div className='wrapper'>


        <div className='left_wrapper'>

          <div className='left_inner'>
            <div className='logo'>
              <img src="/code.png" alt="code flow" />
              <h1 className='codeflow'>Code Flow</h1>
            </div>

            <h4>Connected Users</h4>

            <div className='clients'>
              {
                clients.map((client)=>(
                  <Client key={client.socketId} username={client.username}/>
                )) 
              }
            </div>

          </div>
          <div className='left_outer'>
          <button className='btn cpybtn'>COPY INVITE ID</button>
            <button className='btn leavebtn'>EXIT</button>
            </div>
        </div>











        <div className='right_wrapper'>
          <MainEditor/>
        </div>
      </div>
    </>
  )
}

export default EditorPage

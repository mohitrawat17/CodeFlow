import React from 'react'
import { useState } from 'react'
import '../../src/editor.css'
import Client from '../components/Client'
import MainEditor from '../components/MainEditor'

const EditorPage = () => {
   
   const [Clients,setClients]=useState([
    {socketId:1,userName:'Mohit Rawat'},
    {socketId:2,userName:'Archit Dhyani'},
    {socketId:2,userName:'Manas Kandpal'},
    {socketId:2,userName:'Ashish Bora'}
    
    
   ])

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
                Clients.map((client)=>(
                  <Client key={client.socketId} username={client.userName}/>
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

import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {v4} from 'uuid'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import multiavatar from '@multiavatar/multiavatar';

const Home = () => {
const navigate=useNavigate();

    const [userid,setuserid]=useState('')
    const [userName,setuserName]=useState('')


   const randomId=(e)=>{
   e.preventDefault();
   const id=v4();
     setuserid(id);


     toast.success('Invite code created', {
        className:"tost_success",
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
   };



const join=()=>{
    if(!userid || !userName){
        toast.error('Please fill in all fields',{
            className:"tost_success",
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
         });
              return;
    }
    
    navigate(`/editor/${userid}`,{
        state: {
            userName,
        },
      })
}


const joinOnEnter=(e)=>{
    if(e.code==='Enter'){
       join();
    }
}




//avatar



function updateAvatar(name){
    let divSvg=document.getElementById('divSvg');
    if(name.length){
        var svg=multiavatar(name);
        divSvg.innerHTML=svg;
        console.log(svg);
    }
    else{
        divSvg.innerHTML='';
    }
}


window.addEventListener('DOMContentLoaded',()=>{
    let txtName=document.getElementById('textt');
    txtName.addEventListener('keyup',(e)=>{
        updateAvatar(e.target.value);
    });
});
    return (
        <div className='homePgWrap'>
            <div className='box'>
                <div className='form'>
                    <div >
                        <div className='logo'>
                            <img src="code.png" className="code_flow" />
                            <h1 className='code'>Code Flow</h1>


                            
                        </div>
                        {/* <h4 className='ide'>A real time IDE</h4> */}
                    </div>
                    <img src='pngegg.png' className='avaLogo'></img>
                    {/* <h4 className='msg'>Paste invitation ID</h4> */}
                    {/* <div id='divSvg' style={{width:"100px",height:"100px"}}></div> */}
                    <div className='inputs'>
                    <div className='inp1'>
                    <i className="fas fa-user"></i>
                        <input type="text" placeholder='USER NAME' value={userName} onChange={(e)=>setuserName(e.target.value)} className='inpBox' id='textt' onKeyUp={joinOnEnter} />
                        </div>
                        <div className='inp2'>
                        <i className="fas fa-lock"></i>
                        <input type="text" placeholder='ID' value={userid} onChange={(e)=>setuserid(e.target.value)} className='inpBox' onKeyUp={joinOnEnter} />
                        </div>
                        <button className='btn joinBtn' onClick={join}>Login</button>
                        <span className='info' >
                            If you don't have an invite then create&nbsp;<a href="" className='newRoom' onClick={randomId}> New</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home

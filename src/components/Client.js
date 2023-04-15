import React from 'react'
import multiavatar from '@multiavatar/multiavatar';

const Client = ({username}) => {
    
    const avatarUrl = multiavatar(username);

  return (
    <div className='client_wrapper'> 
    <img style={{width:"43px",height:"45px"}} src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarUrl)}`} />
      <span className='username'>{username}</span>
    </div>
  )
}

export default Client

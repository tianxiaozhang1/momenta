import React, { useState } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Footer = () => {

    let [authTokens, setAuthTokens] = useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const navigate = useNavigate()

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    return (
      <div className='App-footer'>  
      <br></br>
          <div className='Title items-center'>

              <div className='cursor-pointer' onClick={logoutUser}>logout</div>

          </div>
        <br></br>
      </div>
  )
}

export default Footer

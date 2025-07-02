import React, { useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify';

function LoginPopup({setShowLogin}) {

    const {url, setToken} = useContext(StoreContext)

    const [currState, setCurrState] = useState('Sign Up')
    const [data, setData] = useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeHandler = (event) => {

        const name = event.target.name;
        const value = event.target.value
        setData(data=>({...data,[name]:value}))
    }

    const onLogin = async(event) => {
        event.preventDefault()
        let newUrl = url
        if (currState==='Login') {
            newUrl+="/api/v1/user/login"
        } else {
            newUrl+="/api/v1/user/register"
        }

        const response = await axios.post(newUrl,data)
        if (response.data.success) {
            setToken(response.data.data)
            localStorage.setItem("token",response.data.data)
            setShowLogin(false)
            toast.success(response.data.message)
        }
        else{
            toast.error("Error")
        }
    }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currState==='Login'?<></>:<input name='name' value={data.name} onChange={onChangeHandler} type="text" placeholder='Your name' required />}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                <input name='password' value={data.password} onChange={onChangeHandler} type="password" placeholder='password' required />
            </div>
            <button>{currState==='Sign Up'?'Create Account':'Login'}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By continuing, I agree to the terms of use & privacy Policy</p>
            </div>

            {currState==='Login'
            ?<p>Create a new account? <span onClick={()=>setCurrState('Sign Up')}>Click here</span></p>
            :<p>Already have an account? <span onClick={()=>setCurrState('Login')}>Login here</span></p>}
        </form>
    </div>
  )
}

export default LoginPopup
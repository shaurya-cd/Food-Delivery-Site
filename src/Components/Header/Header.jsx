import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

function Header() {
  return (
    <div className='header'>
        <div className="header-contents" >
            <h2>Order your favourite food here</h2>
            <p>Craving food? Order your favorites in seconds! Would you like more variations—funny, elegant, or techy?</p>
            <button><a href="#explore-menu">View Menu</a></button>
        </div>
    </div>
  )
}

export default Header
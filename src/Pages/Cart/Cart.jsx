import React, { useContext } from 'react'
import'./Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { Link } from 'react-router-dom'

function Cart() {

    const {food_list, cartItems, removeFromCart, getTotalCartAmount} = useContext(StoreContext)

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-item-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr /> 
        {food_list.map((item,index)=>{
          if (cartItems[item._id]>0) {
            return (
              <div>
               <div className='cart-item-title cart-items-item'>
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>${item.price*cartItems[item._id]}</p>
                <p className='cross' onClick={()=>removeFromCart(item._id)}>X</p>
              </div> 
              <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>${2}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Total</p>
              <p>${getTotalCartAmount()+2}</p>
            </div>
          </div>
          <Link to='/order'><button>PROCEED TO CHECKOUT</button></Link>
        </div>
        <div className="cart-promocode">
            <div>
              <p>If you have promo code, Enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder='promo code' />
                <button>Submit</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Cart
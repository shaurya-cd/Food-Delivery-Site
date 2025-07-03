import React,{useEffect} from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function PlaceOrder() {

    const {cartItems,getTotalCartAmount,token,food_list,url} = useContext(StoreContext)

    const [data, setData] = React.useState({
        firstName: "",
        lastName: "",   
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const onChangeHandler = (e) => {
      const { name, value } = e.target;
      setData((data) => ({...data, [name]: value }));
    }

    const placeOrder = async (event) => {
      event.preventDefault()
      let orderItems = [];
      food_list.map((item) => {
        if (cartItems[item._id]>0) {
          let itemInfo = item
          itemInfo["quantity"] = cartItems[item._id]
          orderItems.push(itemInfo)
        }
      })
      let orderData = {
        address:data,
        items: orderItems,
        amount: getTotalCartAmount()+2,
      }
      let response = await axios.post(`${url}/api/v1/order/place`, orderData,{headers: {token}})
      if (response.data.success) {
        const { razorpayOrder } = response.data;
        const paymentObject = new window.Razorpay({
          key:"rzp_test_rdSWJ77tNdv0Af",
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          order_id: razorpayOrder.id,
          name: "Tomato",
          description: "Food Order",
          handler: function (response) {
            console.log(response);
            const option2 = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature:response.razorpay_signature
            }
            axios.post(`${url}/api/v1/order/verify`, option2, {headers: {token}})
              .then((res) => {
                if (res.data.success) {
                  toast.success("Payment successful");
                  navigate("/myOrders");
                } else {
                  toast.error("Payment verification failed");
                  navigate("/myOrders");
                }
              })
              .catch((err) => { 
                console.error("Payment verification error:", err);
                alert("Payment verification error");
              });
          },
          prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
          },
          theme: {
            color: "#3399cc",
          },
        });
        paymentObject.open();
      }       
    }


    const loadScript = (src) => {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
              resolve(true);
            }
            script.onerror = () => {
              resolve(false);
            }
            document.body.appendChild(script)
          })
        }

        const navigate = useNavigate()
    
        useEffect(()=>{
          loadScript("https://checkout.razorpay.com/v1/checkout.js")
          if(!token){
            navigate("/cart")
          }else if (getTotalCartAmount()===0) {
            toast.error("Cart is empty")
            navigate("/cart")
          }
        },[token])






  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Infomation</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address'/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="" placeholder='Street'/>
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
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
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Total</p>
              <p>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</p>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
import React from 'react'
import './Verify.css'
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

function Verify() {

  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const {url} = useContext(StoreContext);


  return (
    <div className='verify'>
      <div className="spinner">

      </div>
    </div>
  )
}

export default Verify
import React from 'react'
import CenterDatabase from '../Database/centerDatabase'
import CenterTableContent from '../Database/centerTableContent'
import Navigation from '../Navigation'

const BillingForm = () => {
  return (
    <>
      <div>
        <Navigation />
      </div>
      <div>
        <CenterDatabase />
      </div>
    </>
  )
}

export default BillingForm
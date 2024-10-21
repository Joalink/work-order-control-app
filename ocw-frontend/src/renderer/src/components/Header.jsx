import React from 'react'
import ReymaLogo from '../assets/images/reyma_logo.png'

export default function Header() {
  return (
    <div className='py-5'>
    <div className='flex flex-row flex-auto justify-center items-center'>
      {/* <img src={ReymaLogo} alt="reyma-logo" className='responsive-img'/> */}
      <div className='p-8 text-2xl font-bold text-blue-900 text-center'>
        {/* <p className='uppercase'>Taller de torno</p> */}
        <p className='uppercase'> Control de Ordenes de Trabajo</p>
      </div>
    </div>
  </div> 
  )
}

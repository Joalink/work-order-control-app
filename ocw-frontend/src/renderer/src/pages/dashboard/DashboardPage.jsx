import React from 'react'
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import ReturnButton from '../../components/ReturnButton';

import Charts from './components/Charts';

export default function DashboardPage() {



  return (
    <>
      <TopBar></TopBar>
      <Header></Header>
      <div className="w-full  flex items-center justify-center">
        <div className=' w-[98%] h-8 rounded-t-lg' >
          <div className='flex px-2'>
            <ReturnButton></ReturnButton>
            <div className='flex-grow flex justify-center items-center text-2xl font-bold text-blue-900 text-center content-center pl-10'>
              <p className='uppercase'>Estadisticas</p>
            </div>
            
          </div >

          

          <Charts></Charts>
        </div>
      </div>
    </>
  )
}

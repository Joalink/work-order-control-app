import React from 'react'
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import ReturnButton from '../../components/ReturnButton';

export default function AnalyticsPage() {
  return (

    <>
    <TopBar></TopBar>
    <Header></Header>
    <div className="w-full  flex items-center justify-center">
      <div className=' w-[98%] h-8 rounded-t-lg' >
        <div className='flex px-2'>
          <ReturnButton></ReturnButton>
        </div >
        <div>Analytics</div>
      </div>
    </div>
  </>
    
  )
}

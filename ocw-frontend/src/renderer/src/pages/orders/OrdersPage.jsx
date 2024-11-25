import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'

export default function OrdersPage() {

  useEffect(() => {
    handleToActive()
  }, [] );

  const [title, setTitle] = useState('');
  const [activeButton, setActiveButton] = useState(null)

  const handleToActive = () => {
    setActiveButton('active')
    setTitle('Active Orders')
  }

  const handleToCuttting = () => {
    setActiveButton('cutting')
    setTitle('Cut Material')
  }

  const handleToProcessed = () => {
    setActiveButton('processed');
    setTitle('Work Process');
  };

  const handleToFinished = () => {
    setActiveButton('finished');
    setTitle('Completed Orders');
  };

  const buttons = [
    {
      text: 'Active Orders',
      route: 'active',
      active: activeButton === 'active',
      onClick: handleToActive
    },
    {
      text: 'Cut Material',
      route: 'cutting',
      active: activeButton === 'cutting',
      onClick: handleToCuttting
    },
    {
      text: 'Processed Orders',
      route: 'processed',
      active: activeButton === 'processed',
      onClick: handleToProcessed
    },
    {
      text: 'Completed Orders',
      route: 'finished',
      active: activeButton === 'finished',
      onClick: handleToFinished
    }
  ]


  return (
    <>
      <Navbar tittle={title} buttons={buttons}></Navbar>
      <Outlet />
    </>
  )
}
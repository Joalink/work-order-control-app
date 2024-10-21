import React, { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import ReturnButton from '../../components/ReturnButton';
import NewOrder from './NewOrderPage'

import { Button } from '@mui/material';

export default function OrdersPage() {

  useEffect(() => {
    handleToNewOrder();
  }, [] );

  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [activeButton, setActiveButton] = useState(null)

  const handleToNewOrder = () => {
    setActiveButton('newOrder');
    navigate ('neworder')
    setText('Ordenes de Activas');
  };

  const handleToCutOrder = () => {
    setActiveButton('cutOrder');
    navigate ('cutorder')
    setText('Ordenes de Corte de Material');
  };

  const handleToProcessOrder = () => {
    setActiveButton('processOrder');
    navigate ('processorder')
    setText('Ordenes de Trabajo');
  };

  const handleToFinishedOrder = () => {
    setActiveButton('finishedOrder');
    navigate ('finishedorder')
    setText('Ordenes Finalizadas');
  };


  return (
    <>
      <TopBar></TopBar>
      <Header></Header>
      <div className="w-full  flex items-center justify-center">
        <div className=' w-[98%] h-8 rounded-t-lg pb-12 border-b-2 border-gray-300' >
          <div className='flex px-2'>
            <ReturnButton></ReturnButton>
            <div className='px-4'>
              <Button 
              sx={{
                  backgroundColor: activeButton === 'newOrder' ?  "white" :"#1976d2", 
                  color: activeButton === 'newOrder' ? "#1976d2" : "white", 
                  margin:"0 4px",
                  border: activeButton === 'newOrder' ?"1px solid #1976d2" : "1px solid white" ,
                  '&:hover': { 
                    backgroundColor:"white", 
                    color:"#1976d2", 
                    border:"1px solid #1976d2"
                  }}}
                  onClick={handleToNewOrder}
              >
                Ordenes Activas
              </Button>
              <Button 
                sx={{
                  backgroundColor: activeButton === 'cutOrder' ?  "white" : "orange", 
                  color: activeButton === 'cutOrder' ? "orange" : "black", 
                  margin:"0 4px",
                  border: activeButton === 'cutOrder' ?"1px solid orange" : "1px solid black",
                  '&:hover': { 
                    backgroundColor:"white", 
                    color:"orange", 
                    border:"1px solid orange"
                  }}}
                  onClick={handleToCutOrder}
              >
                Ordenes de Corte
              </Button>
              <Button 
                sx={{
                    backgroundColor: activeButton === 'processOrder' ? "white" : "yellow", 
                    color: activeButton === 'processOrder' ? "yellow" : "black", 
                    margin:"0 4px", 
                    border:activeButton === 'processOrder' ? "1px solid yellow": "1px solid black",
                    '&:hover': { 
                      backgroundColor:"white", 
                      color:"yellow", 
                      border:"1px solid yellow"
                    }}}
              onClick={handleToProcessOrder}
              >
                Ordenes de trabajo
              </Button>
              <Button 
                sx={{
                    backgroundColor: activeButton === 'finishedOrder' ? "white": "red", 
                    color:activeButton === 'finishedOrder' ? "red": "white", 
                    margin:"0 4px", 
                    border: activeButton === 'finishedOrder' ? "1px solid red" : "1px solid white",
                    '&:hover': { 
                      backgroundColor:"white", 
                      color:"red", 
                      border:"1px solid red"
                    }}}
              onClick={handleToFinishedOrder}
              >
                Ordenes Finalizadas
              </Button>
            </div>
            <div className='flex-grow flex justify-center items-center text-2xl font-bold text-blue-900 text-center content-center pl-10'>
              <p className='uppercase'>{text}</p>
            </div>
          </div >
        </div>
      </div>
      <Outlet/>
    </>
  )
}
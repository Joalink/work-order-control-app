import React from 'react'
import ReturnButton from './ReturnButton'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Navbar({tittle, buttons = [] }) {

  const navigate = useNavigate()

  const handleButtonClick = (button) => {
    if (button.onClick) {
      button.onClick() 
    }
    if (button.route) {
      navigate(button.route) 
    }
  }
  return (
    <div className="px-2">
      <div className="flex ">
        <ReturnButton></ReturnButton>
        {buttons.map((button, index) => (
          <Button
            key={index}
            sx={{
              backgroundColor: button.active ? 'white' : '#1976d2',
              color: button.active ? '#1976d2' : 'white',
              margin: '0 4px',
              border: button.active ? '1px solid #1976d2' : '1px solid white',
              '&:hover': {
                backgroundColor: 'white',
                color: '#1976d2',
                border: '1px solid #1976d2'
              }
            }}
            onClick={() => handleButtonClick(button)}
          >
            {button.text}
          </Button>
        ))}
        <div className="flex-grow flex justify-center items-center text-2xl font-bold text-blue-900 text-center content-center pl-10">
          <p className="uppercase">{tittle}</p>
        </div>
      </div>
      <div className=" w-[98%] rounded-t-lg border-b-2 border-gray-300 m-4"></div>
    </div>
  )
}

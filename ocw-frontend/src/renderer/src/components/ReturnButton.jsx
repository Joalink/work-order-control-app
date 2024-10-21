import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { ArrowLeft } from 'react-feather'

export default function ReturnButton() {

  const navigate = useNavigate();

  const handleToHome = () => {
    navigate("/")
  }
  return (
    <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    >
        <Button
        className="rounded-full border-black"
        onClick={handleToHome}
        sx={{
          borderRadius: '50%', 
          // border: '1px solid #141294', 
          padding: '2px', 
          minWidth: 0, 
          width: '32px', 
          height: '32px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: '#f0f0f0', 
          },
        }}
      >
        <ArrowLeft size={24} style={{ color: 'red' }} />
      </Button>
    </div>

  )
}
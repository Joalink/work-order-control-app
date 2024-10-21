import React from 'react'
import { X, Minus, Maximize } from 'react-feather';

export default function TopBar() {

    const handleClose=()=> {
        window.electron.ipcRenderer.send("close-window")
    }

    const handleMinimize=()=> {
        window.electron.ipcRenderer.send("minimize-window")
    }

    const handleMaximze=()=> {
      window.electron.ipcRenderer.send("maximize-window")
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      <div id='control-bg' className='bg-blue-900 w-screen h-3' style={{WebkitAppRegion:"drag"}}></div>
      <div className='bg-blue-900 w-screen h-7' ></div>

        <div id='control-buttons' className='text-stone-200 absolute top-1 right-0 pe-2'>
          <button id='minimize' className='p-1' onClick={handleMinimize}><Minus size={24} color="white"/></button>
          <button id='minimize' className='p-1' onClick={handleMaximze}><Maximize size={20} color="white" /></button>
          <button id='close' className='p-1' onClick={handleClose}><X size={24} color="white" /></button>
        </div>
    </div>
  )
}


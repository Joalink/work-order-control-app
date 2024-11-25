import React from 'react'
import CutOrderForm from './components/forms/CutOrderForm'
import MaterialReceptionForm from './components/forms/MaterialReceptionForm'
import CuttingTable from './components/tables/CuttingTable'
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react'
import { TextField } from '@mui/material'
import { Search } from 'react-feather'

export default function Cutting() {

  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleClose = () => setOpen(true);

  const triggerTableRefresh = () => {
    setRefreshTrigger(prev => prev + 1); 
  };

  return (
    <>
    <div className='mx-auto flex flex-col justify-center w-[98%] pt-2'>
      <div className='flex flex-row justify-evenly items-center'>
          <CutOrderForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh}></CutOrderForm>
          <MaterialReceptionForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh} refreshTrigger={refreshTrigger}></MaterialReceptionForm>
        </div>
        <div className='flex flex-row flex-auto py-2'>
          <CuttingTable refreshTrigger={refreshTrigger}></CuttingTable>
        </div>
    </div>
    </>
  );
} 

import React from 'react'
import CutOrderForm from './components/forms/CutOrderForm'
import MaterialReceptionForm from './components/forms/MaterialReceptionForm'
import CutOrdersTable from './components/tables/CutOrdersTable'
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react'
import { TextField } from '@mui/material'
import { Search } from 'react-feather'

export default function CutOrderPage() {

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
      <TextField
          id="standard-search"
          placeholder='Search...'
          type="search"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="gray" />
              </InputAdornment>
            ),
          }}
        />
          <CutOrderForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh}></CutOrderForm>
          <MaterialReceptionForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh} refreshTrigger={refreshTrigger}></MaterialReceptionForm>
        </div>
        <div className='flex flex-row flex-auto py-2'>
          <CutOrdersTable refreshTrigger={refreshTrigger}></CutOrdersTable>
        </div>
    </div>
    </>
  );
} 

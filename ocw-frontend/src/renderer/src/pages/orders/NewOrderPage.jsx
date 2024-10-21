import React from 'react'
import NewOrderForm from './components/forms/NewOrderForm'
import FinishOrderForm from './components/forms/FinishOrderForm'
import OrdersTable from './components/tables/OrdersTable'
import { useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material'
import { Search } from 'react-feather'


export default function NewOrderPage() {

  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const triggerTableRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Form subido ')
  };

  return (
    <>
      <div className='mx-auto flex flex-col justify-center w-[98%] pt-2'>

        <div className='flex flex-row justify-evenly items-start items-center'>
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
          <NewOrderForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh}></NewOrderForm>
          <FinishOrderForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh}></FinishOrderForm>
        </div>

        <div className='flex py-2 '>
          <OrdersTable refreshTrigger={refreshTrigger}></OrdersTable>
        </div>

      </div>

    </>
  );
} 

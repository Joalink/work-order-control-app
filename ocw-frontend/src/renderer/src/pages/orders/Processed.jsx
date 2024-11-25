import React from 'react'
import AsssigWorkForm from './components/forms/AssignWorkForm'
import FinishWorkForm from './components/forms/FinishWorkForm'
import ProcessedTable from './components/tables/ProcessedTable'
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react'
import { TextField } from '@mui/material'
import { Search } from 'react-feather'


export default function Processed() {

  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const triggerTableRefresh = () => {
    setRefreshTrigger(prev => prev + 1); 
  };

  return (
    <>
      <div className='mx-auto flex flex-col justify-center w-[98%] pt-2'>
        <div className='flex flex-row justify-evenly items-center'>
          <AsssigWorkForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh}></AsssigWorkForm>
          <FinishWorkForm open={open} onClose={handleClose} onOrderCreated={triggerTableRefresh} refreshTrigger={refreshTrigger}></FinishWorkForm>
        </div>
        <div className='flex flex-row flex-auto py-2'>
          <ProcessedTable refreshTrigger={refreshTrigger}></ProcessedTable>
        </div>
      </div>

    </>
  );
} 

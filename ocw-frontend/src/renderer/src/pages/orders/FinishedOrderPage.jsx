import React from 'react'
import FinishedOrdersTable from './components/tables/FinishedOrdersTable'
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material'
import { Search } from 'react-feather'


export default function FinishedOrderPage() {
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

        </div>
        <div className='flex py-2 '>
          <FinishedOrdersTable ></FinishedOrdersTable>
        </div>
      </div>
    </>
  );
} 

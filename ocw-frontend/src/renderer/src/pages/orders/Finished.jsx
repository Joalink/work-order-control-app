import React from 'react'
import FinishedTable from './components/tables/FinishedTable'
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material'
import { Search } from 'react-feather'


export default function Finished() {
  return (
    <>
      <div className='mx-auto flex flex-col justify-center w-[98%] pt-2'>
        <div className='flex py-2 '>
          <FinishedTable ></FinishedTable>
        </div>
      </div>
    </>
  );
} 

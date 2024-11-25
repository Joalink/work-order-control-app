import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import apiService from '../../../services/apiService';
import * as XLSX from 'xlsx';

export default function ExportExcel() {
  const [data, setData] = useState([])

  const currentDate = new Date();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  
  const day = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const fileName = `movements_${month}-${year}.xlsx`;
  

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await apiService.get('inventory/api/v1/stock_movement/')
      const fields = data.map((item) => {
        return {
          product: item.product,
          quantity: item.quantity,
          delivery: item.delivery,
          reception: item.reception,
          date: item.date
        }
      })
      setData(fields)
    } catch (err) {
      setError(err.message)
    }
  }

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    XLSX.writeFile(workbook, fileName)
  }

  return (
    <div>
      <Button variant="contained" color="success" onClick={exportExcel}>
        Export Excel
      </Button>
    </div>
  )
}

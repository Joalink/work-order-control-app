import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Edit } from 'react-feather';
import {useEffect, useState} from "react";
import apiService from '../../../../services/apiService';

const columns = [
    {
        id: 'num_of_order',
        label: 'Order',
        minWidth: 40,
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 300,
  },
    {
        id: 'service',
        label: 'Service',
        minWidth: 80
    },
    {
      id: 'assignment_date',
      label: 'Creating Date',
      minWidth: 80,
    },
    {
        id: 'final_date',
        label: 'Finish Date',
        minWidth: 80,
    },

    {
      id: 'material_status',
      label: 'Material Status',
      minWidth: 100,
    },
    {
      id: 'cut_order',
      label: 'Cut Order',
      minWidth: 100,
    },
    {
        id: 'general_status',
        label: 'General Status',
        minWidth: 100,
    },
    {
      id: 'shift',
      label: 'Shift',
      minWidth: 100,
    },
    // {
    //     id: 'actions',
    //     label: 'Actions',
    //     minWidth: 100,
    //     align: 'center',
    // },
];

export default function ActiveTable({ refreshTrigger }) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // function handleEdit (id){
  // }

  function createData(num_of_order, description, service, assignment_date, final_date, material_status, cut_order, general_status, shift, actions) {
    return { 
      num_of_order, 
      description, 
      service, 
      assignment_date, 
      final_date, 
      material_status, 
      cut_order, 
      general_status, 
      shift, 
      actions 
    };
  }

  const fetchOrders = async () => {
    try {
      const data = await apiService.get('orders/api/main_table')
      setOrders(data);
      setRows(data.map(item => createData(
        item.num_of_order,
        item.description,
        item.service,
        item.assignment_date,
        item.final_date,
        item.material_status,
        item.cut_order,
        item.general_status,
        item.shift
      )));
      } catch (err) {
        setError(err.message);
      } 
  };


  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="orders table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, color: 'black', fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                            {
                                column.id === 'actions' ? (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Edit color='gray' style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => handleEdit(row.id)} />
                                    </div>
                                ) :
                                column.format && typeof value === 'number' ? column.format(value) : value
                            }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
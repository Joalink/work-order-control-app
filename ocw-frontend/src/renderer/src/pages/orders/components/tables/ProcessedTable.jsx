import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {useEffect, useState} from "react";
import apiService from '../../../../services/apiService';
import { MoreHorizontal } from 'react-feather';

const columns = [
    { 
        id: 'num_of_order', 
        label: 'Order',
        minWidth: 100,
    },
    { 
        id: 'description', 
        label: 'Description', 
        minWidth: 300,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'service',
      label: 'Service',
      minWidth: 100,
    },
    {
        id: 'priority',
        label: 'Priority',
        minWidth: 100,
        
    },
    {
        id: 'general_status',
        label: 'Status',
        minWidth: 100,
    },
    {
        id: 'material_status',
        label: 'Material Status',
        minWidth: 100,
    },
    {
      id: 'shift',
      label: 'Shift',
      minWidth: 100,
    },
];

export default function ProcessedTable({ refreshTrigger }) {

  useEffect(() => {
    fetchProcessOrders();
  }, [refreshTrigger]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orders, setCutOrders] = useState([]);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(num_of_order, description, priority, service, general_status, material_status, shift) {
    return { num_of_order, description, priority, service, general_status, material_status, shift };
  }

  const fetchProcessOrders = async () => {
    try {
      const data = await apiService.get('orders/api/process_table/')
      setCutOrders(data);
      setRows(data.map(item => createData(
        item.num_of_order,
        item.description,
        item.priority,
        item.service,
        item.general_status,
        item.material_status,
        item.shift
      )));
      } catch (err) {
        setError(err.message);
        console.error('failed to load cut orders:',err);
      } finally {
    }
  };

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
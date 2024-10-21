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
        label: 'Orden',
        minWidth: 40,
    },
    {
      id: 'description',
      label: 'Descripcion',
      minWidth: 300,
  },
    {
        id: 'service',
        label: 'Servicio',
        minWidth: 80
    },
    {
      id: 'assignment_date',
      label: 'Fecha Creacion',
      minWidth: 80,
      // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'final_date',
        label: 'Fecha Vencimiento',
        minWidth: 80,
    },

    {
      id: 'material_status',
      label: 'Estado Material',
      minWidth: 100,
      // format: (value) => value.toFixed(2),
    },
    {
      id: 'cut_order',
      label: 'Orden de Corte',
      minWidth: 100,
      // format: (value) => value.toFixed(2),
    },
    {
        id: 'general_status',
        label: 'Estado General',
        minWidth: 100,
        // format: (value) => value.toFixed(2),
    },
    {
      id: 'shift',
      label: 'Turno',
      minWidth: 100,
    },
    {
        id: 'actions',
        label: 'Acciones',
        minWidth: 100,
        align: 'center',
    },
];

export default function OrdersTable({ refreshTrigger }) {

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

  function handleEdit (id){
    console.log('Edit:', id)

  }

  function createData(num_of_order, description, service, assignment_date, final_date, material_status, cut_order, general_status, shift, actions) {
    return { num_of_order, description, service, assignment_date, final_date, material_status, cut_order, general_status, shift, actions };
  }

  const fetchOrders = async () => {
    try {
      const data = await apiService.get('/main_table');
      setOrders(data);
      console.log('orders loaded success', data);
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
        console.error('failed to load orders:',err);
      } finally {
    }
  };


  useEffect(() => {
    // console.log('useEffect triggered with refreshTrigger:', refreshTrigger);
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
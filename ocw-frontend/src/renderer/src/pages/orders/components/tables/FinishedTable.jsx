import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Download } from 'react-feather';
import {useEffect, useState} from "react";
import apiService from '../../../../services/apiService';
import { generatePDF } from '../../../../utils/generatePDF';

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
    id: 'delivery_date',
    label: 'Delivery Date',
    minWidth: 80,
  },
  { 
    id: 'service', 
    label: 'Service', 
    minWidth: 80
  },
  {
    id: 'area',
    label: 'Area',
    minWidth: 100,
    format: (value) => value.toFixed(2),
  },
  {
    id: 'num_of_pieces',
    label: 'No. of pieces',
    minWidth: 100,
    format: (value) => value.toFixed(2),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 100,
    align: 'center',
  },
];

export default function FinishedTable() {

  useEffect(() => {
    fetchOrders();
  }, []);

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

  async function handleDownload(row) {
    try {
      const data = await apiService.get(`orders/api/generate_PDF/${row}`)
      generatePDF(data)
    } catch (err) {
      setError(err.message)
    }
  }

  function createData(id,num_of_order, description, delivery_date, service, area, num_of_pieces, actions) {
    return { id, num_of_order, description, delivery_date, service, area, num_of_pieces, actions };
  }

  const fetchOrders = async () => {
    try {
      const data = await apiService.get('orders/api/finished_orders')
      setOrders(data);
      setRows(data.map(item => createData(
        item.id,
        item.num_of_order,
        item.description,
        item.delivery_date,
        item.service,
        item.area,
        item.num_of_pieces,
      )));
      } catch (err) {
        setError(err.message);
        console.error('failed to load orders:',err);
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {
                        column.id === 'actions' ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Download color="gray" style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => handleDownload(row.id)}/>
                        </div>
                        ) : column.format && typeof value === 'number' ? (column.format(value)) : (value)
                      }
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
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
};
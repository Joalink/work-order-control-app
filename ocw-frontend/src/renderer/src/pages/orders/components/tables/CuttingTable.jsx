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
import AssignmentCutsTable from './AssignmentCutsTable';

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
        id: 'cut_order',
        label: 'Cut Order',
        minWidth: 100,

    },
    {
      id: 'num_of_pieces',
      label: 'No. of pieces',
      minWidth: 100,
    },
    {
        id: 'material_status',
        label: 'Material Status',
        minWidth: 100,
    },
    {
        id: 'assigned_cuts',
        label: 'Assigned Cuts',
        minWidth: 100,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 50,
      align: 'center',
  },
];

export default function CuttingTable({ refreshTrigger }) {

  useEffect(() => {
    fetchCutOrders();
  }, [refreshTrigger]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setCutOrders] = useState([]);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setselectedOrder] = useState(null);

  const [newCuts, setNewCuts] = useState(null);

  const handleOpenModal = (row) => {
    setselectedOrder(row.num_of_order); 
    setNewCuts(refreshTrigger)
    setModalOpen(true); 
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(num_of_order, description, num_of_pieces, cut_order, material_status, assigned_cuts, actions) {
    return { num_of_order, description, num_of_pieces, cut_order, material_status, assigned_cuts, actions };
  }

  const fetchCutOrders = async () => {
    try {
      const data = await apiService.get('orders/api/cut_table')
      setCutOrders(data);
      setRows(data.map(item => createData(
        item.num_of_order,
        item.description,
        item.num_of_pieces,
        item.cut_order,
        item.material_status,
        item.assigned_cuts
      )));
      } catch (err) {
        setError(err.message);
      }
  };

  return (
    <>
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
                              <MoreHorizontal
                                color='gray'
                                style={{ cursor: 'pointer', marginRight: 12 }}
                                onClick={() => handleOpenModal(row)} 
                              />
                            </div>
                          ) :
                          column.format && typeof value === 'number' ? column.format(value) : value
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
      {modalOpen && (
        <AssignmentCutsTable 
          open={modalOpen} 
          onClose={handleCloseModal} 
          refreshTrigger={newCuts}
          selectedOrder={selectedOrder}
        />
      )}
    </>
  );
}
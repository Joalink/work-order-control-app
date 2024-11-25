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
import { Modal } from '@mui/material';
import {Button, Box} from '@mui/material';
import { X } from 'react-feather';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #1565C0',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

const columns = [
    { id: 'num_cut_order', label: 'No. of cut order', minWidth: 100 },
    { id: 'work_order', label: 'Order', minWidth: 100 },
    { id: 'material_status', label: 'Material Status', minWidth: 100 },
    { id: 'material_type', label: 'Material Type', minWidth: 100 },
    { id: 'material_quantity', label: 'Material Quantity', minWidth: 100 },
    { id: 'observation', label: 'Observations', minWidth: 200 },
];

export default function AssignmentCutsTable({ refreshTrigger, open, onClose, selectedOrder }) {

    useEffect(() => {
        fetchAssignedCuts();
    }, 
    [refreshTrigger, open]
    );

    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [data, setData] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function createData(num_cut_order, work_order, material_status, material_type, material_quantity, observation) {
        return {num_cut_order, work_order, material_status, material_type, material_quantity, observation};
    }

    const fetchAssignedCuts = async () => {
        try {
        const data = await apiService.get('orders/api/cuts_order_table/')
        setData(data);
        const filterData = data.filter(order => order.work_order === selectedOrder)
        setRows(filterData.map(item => createData(
            item.num_cut_order,
            item.work_order,
            item.material_status,
            item.material_type,
            item.material_quantity,
            item.observation,
        )));
        } catch (err) {
            setError(err.message);
            console.error('failed to load cut orders:',err);

        if (err.response) {
            console.error('Error response data:', err.response.data);

            }
        }
    };

    return (
        <div>
            <Modal 
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <header className='flex justify-between align-center'>
                        <div className='flex items-center text-neutral-500 font-semibold'>Ordenes para cortar</div>
                        <Button onClick={onClose}><X size={24} color="gray" /></Button> 
                    </header>
                    <body className='max-w-2xl px-5 overflow-hidden py-4'>
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
                    </body>
                </Box>
            </Modal>
        </div>
    );
}
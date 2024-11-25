import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { Edit } from 'react-feather'
import { useEffect, useState } from 'react'
import apiService from '../../../../services/apiService';

const columns = [
  {
    id: 'product',
    label: 'Product',
    minWidth: 80
  },
  {
    id: 'quantity',
    label: 'Quantity',
    minWidth: 80
  },
  {
    id: 'delivery',
    label: 'Delivery',
    minWidth: 80
  },
  {
    id: 'reception',
    label: 'Receive',
    minWidth: 80
  },
  {
    id: 'date',
    label: 'Movement Date',
    minWidth: 80
  }
]

export default function MovementsTable({ refreshTrigger }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [rows, setRows] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function handleEdit(id) {
  }

  function createData(product, quantity, delivery, reception, date) {
    return {
      product,
      quantity,
      delivery,
      reception,
      date
    }
  }

  const fetchData = async () => {
    try {
      const data = await apiService.get('inventory/api/v1/stock_movement/')
      setOrders(data);
      setRows(
        data.map((item) =>
          createData(
            item.product,
            item.quantity,
            item.delivery,
            item.reception,
            item.date
          )
        )
      )
      } catch (err) {
        setError(err.message);
      } finally {
    }
  };

  useEffect(() => {
    fetchData()
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? (
                          column.format(value)
                        ) : (
                          value
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
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
  )
}

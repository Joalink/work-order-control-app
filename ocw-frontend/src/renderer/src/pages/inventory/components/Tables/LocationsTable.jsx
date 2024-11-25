import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { Edit, Trash2 } from 'react-feather'
import { useEffect, useState } from 'react'
import apiService from '../../../../services/apiService';

const columns = [
  {
    id: 'identifier',
    label: 'Identifier',
    minWidth: 40
  },
  {
    id: 'name',
    label: 'Name',
    minWidth: 80
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 100,
    align: 'center'
  }
]

export default function LocationsTable({ refreshTrigger, handleEdit, handleDelete }) {
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

  function createData(id, identifier, name) {
    return {
      id,
      identifier,
      name
    }
  }

  const fetchData = async () => {
    try {
      const data = await apiService.get('inventory/api/v1/location')
      setOrders(data)
      setRows(data.map((item) => createData(item.id, item.identifier, item.name)))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchData();
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
                        {column.id === 'actions' ? (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Edit
                              color="gray"
                              style={{ cursor: 'pointer', marginRight: 12 }}
                              onClick={() => handleEdit(row.id)}
                            />
                            <Trash2
                              color="gray"
                              style={{ cursor: 'pointer', marginRight: 12 }}
                              onClick={() => handleDelete(row.id)}
                            />
                          </div>
                        ) : column.format && typeof value === 'number' ? (
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

import * as React from 'react'
import Modal from '@mui/material/Modal'
import { X } from 'react-feather'
import { TextField, Button, Grid, Box, FormControl, FormGroup } from '@mui/material'
import { useState, useEffect } from 'react'
import apiService from '../../../services/apiService'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid #1565C0',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
}

export default function DeleteProduct({ onDelete, open, onClose, id }) {
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open && id) {
    }
  }, [id])

  const handleSubmit = () => {
      try {
        const response = apiService.delete(`inventory/api/v1/product/${id}/`);
        onDelete();
      } catch (err) {
        setError(err.message)
      }
    onClose()
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className="flex justify-between align-center">
            <div className="flex items-center text-neutral-500 font-semibold">Delete Product</div>
            <Button onClick={onClose}>
              <X size={24} color="gray" />
            </Button>
          </header>
          <body className="max-w-2xl px-5 overflow-hidden py-4">
            <div>
              <h1 className="text-xl">Are you sure to delete this product?</h1>
            </div>
          </body>
          <footer className="flex justify-end items-center gap-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Accept
            </Button>
          </footer>
        </Box>
      </Modal>
    </div>
  )
}

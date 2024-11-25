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

export default function EditStock({ onEdit, open, onClose, id }) {
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)

  const [formValues, setFormValues] = useState({
    id:'',
    product: '',
    location: '',
    quantity: ''
  })

  const initialFormValues = {
    id: '',
    product: '',
    location: '',
    quantity: ''
  }

  useEffect(() => {
    if (open && id) {
      getData()
    }
  }, [open, id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updateValue = value.toUpperCase()
    setFormValues({
      ...formValues,
      [name]: updateValue
    })
  }

  const getData = async () => {
    try {
      const response = await apiService.get(`inventory/api/v1/stock/${id}/`)
      setFormValues(response)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiService.patch(`inventory/api/v1/stock/${formValues.id}/`,formValues)
      if (onEdit) {
        setFormValues(initialFormValues)
        onEdit()
      }
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
            <div className="flex items-center text-neutral-500 font-semibold">Edit Stock</div>
            <Button onClick={onClose}>
              <X size={24} color="gray" />
            </Button>
          </header>
          <body className="max-w-2xl px-5 overflow-hidden py-4">
            <Box
              component="form"
              sx={{ mt: 3 }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <FormControl component="fieldset">
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Product" 
                        name="product"
                        disabled
                        value={formValues.product}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Location"
                        name="location"
                        disabled
                        value={formValues.location}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Quantity"
                        name="quantity"
                        type='number'
                        value={formValues.quantity}
                        onChange={handleInputChange}
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
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

import * as React from 'react'
import Modal from '@mui/material/Modal'
import { X } from 'react-feather'
import { TextField, Button, Grid, Box, FormControl, FormGroup, InputLabel, Select, MenuItem } from '@mui/material'
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

export default function AddStock({ onCreated }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])
  
  const [formValues, setFormValues] = useState({
    product: '',
    location: '',
    quantity: ''
  })
  const initialFormValues = {
    product: '',
    location: '',
    quantity: ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updateValue = value.toUpperCase()
    setFormValues({
      ...formValues,
      [name]: updateValue
    })
  }

    const validate = () => {
      let tempErrors = {}
      tempErrors.quantity = formValues.quantity ? '' : 'Enter the quantity of pieces'
      setErrors(tempErrors)
      return Object.values(tempErrors).every((x) => x === '')
    }


  const fetchProducts = async () => {
    try {
      const data = await apiService.get('inventory/api/v1/product')
      setProducts(data)
    } catch (err) {
      setError(err.message)
      .error('failed to load orders:', err)
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await apiService.get('inventory/api/v1/location');
      setLocations(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      try {
        const response = await apiService.post('inventory/api/v1/stock/', formValues)
        if (onCreated) {
          setFormValues(initialFormValues)
          onCreated()
        }
      } catch (err) {
        setError(err.message)
      }
      handleClose()
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, [])

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Create New Stock
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className="flex justify-between align-center">
            <div className="flex items-center text-neutral-500 font-semibold">Create New Stock</div>
            <Button onClick={handleClose}>
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
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Producto</InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          label="Product"
                          name="product"
                          value={formValues.product}
                          onChange={handleInputChange}
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.identifier}>
                              {product.identifier}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Locación</InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          label="Location"
                          name="location"
                          value={formValues.location}
                          onChange={handleInputChange}
                        >
                          {locations.map((location) => (
                            <MenuItem key={location.id} value={location.identifier}>
                              {location.identifier}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Quantity"
                        name="quantity"
                        type="number"
                        inputProps={{ min: '1', step: '1' }}
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
            <Button variant="outlined" onClick={handleClose}>
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

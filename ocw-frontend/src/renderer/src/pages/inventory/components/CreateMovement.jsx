import * as React from 'react'
import Modal from '@mui/material/Modal'
import { X } from 'react-feather'
import {
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useState, useEffect } from 'react'
import apiService from '../../../services/apiService'
import moment from 'moment-timezone'


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

export default function CreateMovement({ onCreated, open, onClose, id }) {
  const timeZone = 'America/Mexico_City'
  const now = moment().tz(timeZone)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [locations, setLocations] = useState([])

  const [formValues, setFormValues] = useState({
    id:'',
    product: '',
    location: '',
    quantity: '',
    quantityToSend: '',
    reception: '',
  })

  const initialFormValues = {
    id: '',
    product: '',
    location: '',
    quantity: '',
    quantityToSend: '',
    reception: '',
  }

  useEffect(() => {
    if (open && id) {
      getData()
    }
    fetchLocations()
  }, [open, id])


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  const validate = () => {
    let tempErrors = {}
    tempErrors.quantityToSend = formValues.quantityToSend ? '' : 'Plase enter a quantity'
    tempErrors.reception = formValues.reception ? '' : 'Plase add a location to send'
    setErrors(tempErrors)
    return Object.values(tempErrors).every((x) => x === '')
  }

  const getData = async () => {
    try {
      const response = await apiService.get(`inventory/api/v1/stock/${id}/`)
      setFormValues(response)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await apiService.get('inventory/api/v1/location')
      setLocations(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newMovement = {
      product: formValues.product,
      delivery: formValues.location,
      reception: formValues.reception,
      quantity: formValues.quantityToSend,
      date: now.format('YYYY-MM-DD')
    }

    const newStock = {
      product: formValues.product,
      location: formValues.reception,
      quantity: formValues.quantityToSend
    }

    const updateStock = {
      product: formValues.product,
      location: formValues.location,
      quantity: formValues.quantity - formValues.quantityToSend
    }


    if (validate()) {
      try {
        const responseM = await apiService.post('inventory/api/v1/stock_movement/', newMovement)
        const responseS = await apiService.post('inventory/api/v1/stock/', newStock)
        const responseU = await apiService.patch(`inventory/api/v1/stock/${formValues.id}/`,updateStock)
        if (onCreated) {
          setFormValues(initialFormValues)
          onCreated()
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to create Order:', err)
      }
      onClose()
    }
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
            <div className="flex items-center text-neutral-500 font-semibold">New Movement</div> 
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
                        name="name"
                        disabled
                        value={formValues.product}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Location"
                        name="Entrega"
                        disabled
                        value={formValues.location}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Available quantity"
                        name="quantity"
                        type="number"
                        disabled
                        value={formValues.quantity}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Quantity to send"
                        name="quantityToSend"
                        type="number"
                        inputProps={{ min: '1', step: '1' }}
                        value={formValues.quantityToSend}
                        onChange={handleInputChange}
                        error={!!errors.quantityToSend}
                        helperText={errors.quantityToSend}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Send to</InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          label="Send to"
                          name="reception"
                          value={formValues.reception}
                          onChange={handleInputChange}
                        >
                          {locations
                            .filter((location) => location.identifier !== formValues.location)
                            .map((location) => (
                              <MenuItem key={location.id} value={location.identifier}>
                                {location.identifier}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
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

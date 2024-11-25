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

export default function EditProduct({ onEdit, open, onClose, id }) {
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)

  const [formValues, setFormValues] = useState({
    id: '',
    identifier: '',
    name: '',
    description: ''
  })

  const initialFormValues = {
    id: '',
    identifier: '',
    name: '',
    description: ''
  }

  useEffect(() => {
    if (open && id){
      getProduct();
    }
    
  }, [open, id]);

  const updateToUpperCase = (name, value) => {
    if (name === 'description') return value
    return value.toUpperCase()
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updateValue = updateToUpperCase(name, value)
    setFormValues({
      ...formValues,
      [name]: updateValue
    })
  };

  const validate = () => {
    let tempErrors = {}
    tempErrors.name = formValues.name ? '' : 'Name is required'
    tempErrors.description = formValues.description ? '' : 'Please add product description'
    setErrors(tempErrors)
    return Object.values(tempErrors).every((x) => x === '')
  };

  const getProduct = async () => {
    try {
      const response = await apiService.get(`inventory/api/v1/product/${id}/`);
      setFormValues(response)
    } catch (err) {
      setError(err.message)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      try {
        const response = await apiService.patch(`inventory/api/v1/product/${formValues.id}/`,
          formValues
        )
        if (onEdit) {
          setFormValues(initialFormValues)
          onEdit()
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to create Order:', err)

        if (err.response) {
          console.error('Error response data:', err.response.data)
        }
      }
      onClose();
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
          <header className="flex justify-between align-center">
            <div className="flex items-center text-neutral-500 font-semibold">Edit Product</div>
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
                        label="Identifier"
                        name="identifier"
                        disabled
                        value={formValues.identifier}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Name"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Description"
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        error={!!errors.description}
                        helperText={errors.description}
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

import * as React from 'react';
import Modal from '@mui/material/Modal';
import { X } from 'react-feather';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormHelperText,
  Select,
  InputLabel,
  MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import apiService from '../../../../services/apiService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid #2e7d32',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

export default function AddOperatorForm({ open, onClose, selectedShift, onOperatorCreated }) {
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    shift: '',
  });

  const initialFormValues = {
    first_name: '',
    last_name: '',
    shift: '',
  };

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      shift:selectedShift || '',
    }))
  }, [open, selectedShift]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.first_name = formValues.first_name ? '' : 'Ingrese el nombre del operador';
    tempErrors.last_name = formValues.last_name ? '': 'Ingrese los apellidos del operador';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const updateToUpperCase = (name, value) => {
    if (name === 'first_name' || name === 'last_name') {
      return value.toUpperCase();
    }
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
    const updateValue = updateToUpperCase(name, value)
    setFormValues({
      ...formValues,
      [name]: updateValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await apiService.post('v1/workers/', formValues);
          console.log('Operador agregado:', response)


          setFormValues(initialFormValues);

          if (onOperatorCreated) {
            onOperatorCreated();
          }

          onClose();


      } catch (err) {
        setError(err.message);
        console.error('Failed to create Order:', err); 

        if (err.response) {
          console.error('Error response data:', err.response.data);
        }
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
            <div className='flex items-center text-neutral-500 font-semibold'>Nuevo Operador</div>
            <Button onClick={onClose}><X size={24} color="gray" /></Button>
          </header>
          <body className='max-w-2xl px-5 overflow-hidden py-4'>
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
                        size='small'
                        label="Nombre(s)"
                        name="first_name"
                        value={formValues.first_name}
                        onChange={handleInputChange}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Apellidos"
                        name="last_name"
                        value={formValues.last_name}
                        onChange={handleInputChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" color="success" onClick={onClose}>Cancelar</Button>
            <Button ype="submit" variant="contained" color="success" onClick={handleSubmit}>Aceptar</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
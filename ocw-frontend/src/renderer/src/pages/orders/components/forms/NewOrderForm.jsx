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
  MenuItem,
  Checkbox, 
  FormControlLabel
} from '@mui/material';
import { useState, useEffect } from 'react';
import apiService from '../../../../services/apiService';
import moment from 'moment-timezone';

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
  borderRadius: '10px',
};

export default function NewOrderForm({ onOrderCreated }) {

  const timeZone = 'America/Mexico_City';
  const now = moment().tz(timeZone);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const [formValues, setFormValues] = useState({
    num_of_order: '',
    description: '',
    area: '',
    carried_by: '',
    authorized_by: '',
    num_of_pieces: '',
    priority: '',
    service: '',
    need_material: false,
    shift: '',
    assignment_date: now.format('YYYY-MM-DD'),
  });

  const initialFormValues = {
    num_of_order: '',
    description: '',
    area: '',
    carried_by: '',
    authorized_by: '',
    num_of_pieces: '',
    priority: '',
    service: '',
    need_material: '',
    assignment_date: now.format('YYYY-MM-DD'),
  };

  const updateToUpperCase = (name, value) => {
    if (name === 'order' || name === 'description' || name === 'num_of_pieces' || name === 'assignment_date' || name === 'need_material')
      return value
    return value.toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updateValue = updateToUpperCase(name, value)
    setFormValues({
      ...formValues,
      [name]: updateValue,
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.num_of_order = formValues.num_of_order ? '' : 'Numero de orden es requerido';
    tempErrors.description = formValues.description ? '' : 'Favor de escribir una descripcion';
    tempErrors.area = formValues.area ? '' : 'Area que solicita es requerida';
    tempErrors.carried_by = formValues.carried_by ? '' : 'Persona que entrega es requerido';
    tempErrors.authorized_by = formValues.authorized_by ? '' : 'Persona que autoriza es requerido';
    tempErrors.num_of_pieces = formValues.num_of_pieces ? '': 'Ingrese la cantidad de piezas'; 
    tempErrors.priority = formValues.priority ? '' : 'Asigne la prioridad de la orden';
    tempErrors.service = formValues.service ? '' : 'Asigne el tipo de servicio';
    tempErrors.assignment_date = formValues.assignment_date ? '' : 'Ingrese la fecha de inicio'; 
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await apiService.post('v1/orders/', formValues);
          console.log('Order create:', response)
          if (onOrderCreated) {
            setFormValues(initialFormValues);
            onOrderCreated(); 
          } 
      } catch (err) {
        setError(err.message);
        console.error('Failed to create Order:', err); 

        if (err.response) {
          console.error('Error response data:', err.response.data);
        }
      }
      handleClose();
    }
  };


  return (
    <div>
      <Button variant='contained' onClick={handleOpen}>Nueva Orden</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>Nueva Orden</div>
            <Button onClick={handleClose}><X size={24} color="gray" /></Button>
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

                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        size='small'
                        label="No. de orden"
                        name="num_of_order"
                        type='number'
                        inputProps={{ min: "0", step: "1" }}
                        value={formValues.num_of_order}
                        onChange={handleInputChange}
                        error={!!errors.num_of_order}
                        helperText={errors.num_of_order}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Descripcion"
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        error={!!errors.description}
                        helperText={errors.description}
                      />
                    </Grid>
                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        size='small'
                        label="Area solicitante"
                        name="area"
                        value={formValues.area}
                        onChange={handleInputChange}
                        error={!!errors.area}
                        helperText={errors.area}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Entrega"
                        name='carried_by'
                        value={formValues.carried_by}
                        onChange={handleInputChange}
                        error={!!errors.carried_by}
                        helperText={errors.carried_by}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Autoriza"
                        name="authorized_by"
                        value={formValues.authorized_by}
                        onChange={handleInputChange}
                        error={!!errors.authorized_by}
                        helperText={errors.authorized_by}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="No. piezas"
                        name="num_of_pieces"
                        type="number"
                        inputProps={{ min: "1", step: "1" }}
                        value={formValues.num_of_pieces}
                        onChange={handleInputChange}
                        error={!!errors.num_of_pieces}
                        helperText={errors.num_of_pieces}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size='small'>
                        <InputLabel id="priority">Prioridad</InputLabel>
                        <Select
                          label="Prioridad"
                          name='priority'
                          value={formValues.priority}
                          onChange={handleInputChange}
                          error={!!errors.priority}
                        >
                          <MenuItem value="1">Urgente | 1d</MenuItem>
                          <MenuItem value="2">1 | 2d</MenuItem>
                          <MenuItem value="3">2 | 4d</MenuItem>
                          <MenuItem value="4">3 | 8d</MenuItem>
                          <MenuItem value="5">4 | 15d</MenuItem>
                          <MenuItem value="6">5 | 30d</MenuItem>
                        </Select>
                        {<FormHelperText style={{color:'red'}}>{errors.priority}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="service">Servicio</InputLabel>
                        <Select
                          label="Servicio"
                          name="service"
                          value={formValues.service}
                          onChange={(e) => {
                            const serviceValue = e.target.value;
                            handleInputChange(e); 
                            if (serviceValue !== '1' || serviceValue !== '5') {
                              setFormValues((prevValues) => ({
                                ...prevValues,
                                need_material: serviceValue === '2' || serviceValue === '4' ? true : false,
                              }));
                            }
                          }}
                          error={!!errors.service}
                        >
                          <MenuItem value="3">Reparacion</MenuItem>
                          <MenuItem value="2">Fabricacion</MenuItem>
                          <MenuItem value="1">Rectificado</MenuItem>
                          <MenuItem value="4">Fabricacion Stock</MenuItem>
                          <MenuItem value="5">Reparacion Stock</MenuItem>
                        </Select>
                        {<FormHelperText style={{ color: 'red' }}>{errors.service}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="need_material"
                              checked={formValues.need_material === true}
                              onChange={(e) =>
                                handleInputChange({
                                  target: {
                                    name: 'need_material',
                                    value: e.target.checked ? true : false,
                                  },
                                })
                              }
                              disabled={formValues.service !== '1' && formValues.service !== '5'}
                              />
                          }
                          label="Need Material"
                        />
                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Fecha de vencimiento"
                        name="assignment_date"
                        type="date"
                        disabled
                        value={formValues.assignment_date}
                        onChange={handleInputChange}
                        error={!!errors.assignment_date}
                        helperText={errors.assignment_date}
                      />
                    </Grid> */}

                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Aceptar</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
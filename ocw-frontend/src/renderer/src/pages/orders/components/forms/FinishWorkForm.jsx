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
import moment from 'moment-timezone';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid #1B5E20',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

export default function FinishWorkForm({ onOrderCreated, refreshTrigger }) {

  useEffect(() => {
    fetchWorkToFinish();
  }, [refreshTrigger]);

  const timeZone = 'America/Mexico_City';
  const now = moment().tz(timeZone);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);


  const [formValues, setFormValues] = useState({
    id: '',
    order_area: '',
    description: '',
    service: '',
    shift: '',
    operator: '',
    work_processes: '',
    assignment_date: '',
    work_order: '',

    start_date: now.format('YYYY-MM-DD'),
    start_time: now.format('HH:mm:ss'),
    end_date: now.format('YYYY-MM-DD'),
    end_time: now.format('HH:mm:ss'),
  
  });

  const initialFormValues = {
    id: '',
    order_area: '',
    description: '',
    service: '',
    shift: '',
    operator: '',
    work_processes: '',
    assignment_date: '',
    work_order: '',

    start_date: now.format('YYYY-MM-DD'),
    start_time: now.format('HH:mm:ss'),
    end_date: now.format('YYYY-MM-DD'),
    end_time: now.format('HH:mm:ss'),
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "order_area") {
      const selectedOrder = orders.find(order => order.order_area === value)
      if(selectedOrder){
        setFormValues({
          ...formValues,
          id: selectedOrder.id,
          order_area: value,
          description: selectedOrder.description,
          service: selectedOrder.service,
          shift: selectedOrder.shift,
          operator: selectedOrder.operator,
          work_processes: selectedOrder.work_processes,
          assignment_date: selectedOrder.assignment_date,
          work_order: selectedOrder.work_order,
        });
      }
    // } 
  //   else if (name === "end_date") {
  //     const currentTime = new Date().toISOString().split('T')[1].split('.')[0]; // Obtener la hora actual (HH:MM:SS)
  //     console.log('date:',value,'time:',currentTime)

  //     setFormValues({
  //       ...formValues,
  //       end_date: value,        
  //       end_time: currentTime,  
  //     });

  //   }     
  //   else if (name === "end_time") {
  //     setFormValues({
  //       ...formValues,
  //       end_time: value,  
  //     });
   } else {     

      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.order_area = formValues.order_area ? '' : 'No. de orden es requerido';
    tempErrors.start_date = formValues.start_date ? '' : 'La fecha de inicio es requerida';
    tempErrors.end_date = formValues.end_date ? '' : 'La fecha de termino es requerida';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const fetchWorkToFinish = async () => {
    try {
      const data = await apiService.get('/work_to_finish');
      console.log('wort to finish data success', data);
      setOrders(data)
      } catch (err) {
        setError(err.message);
        console.error('failed to load works to finish:',err);
      } finally {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted successfully', formValues);

      const dataToUpdate = {

        work_order: formValues.work_order,
    
        start_date: formValues.start_date,
        start_time: formValues.start_time,
        end_date: formValues.end_date,
        end_time: formValues.end_time
      };

      try {
          const response = await apiService.patch(`v1/works/${formValues.id}/`, dataToUpdate );
          console.log('id a enviar:',formValues.id)
          console.log('Datos enviados:', dataToUpdate);
          console.log('Finish Work validate:', response)


          if (onOrderCreated) {
            console.log('onOrderCreated is being called.');
            setFormValues(initialFormValues);
            onOrderCreated(); 
          } else {
            console.warn('onOrderCreated is not defined.');
          }
      } catch (err) {
        setError(err.message);
        console.error('Failed to create Order:', err); 

        if (err.response) {
          console.error('Error response data:', err.response.data);
          // console.error('Error status:', err.response.status);
          // console.error('Error headers:', err.response.headers);
        }
      }
      handleClose();
    }
  };

  return (
    <div>
      <Button variant='contained' color='success' onClick={handleOpen}>Finalizar trabajo</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>Finalizar Trabajo</div>
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


                    <Grid item xs={12}>
                      <InputLabel size='small'>No. de orden</InputLabel>
                      <Select
                        fullWidth
                        size='small'

                        label="No. de orden"
                        name="order_area"
                        value={formValues.order_area}
                        onChange={handleInputChange}
                        error={!!errors.order_area}
                        >
                        {orders.map((order) => (
                          <MenuItem key={order.id} value={order.order_area}>
                            {order.order_area}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Descripcion"
                        name="description"
                        disabled
                        value={formValues.description}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        size='small'
                        label="Servicio"
                        name="service"
                        disabled
                        value={formValues.service}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Turno"
                        name="shift"
                        disabled
                        value={formValues.shift}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Operador"
                        name="operator"
                        disabled
                        value={formValues.operator}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Proceso a realizar"
                        name="work_processes"
                        disabled
                        value={formValues.work_processes}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Fecha de inicio"
                        name="start_date"
                        type="date"
                        InputLabelProps={{shrink: true}}    
                        value={formValues.start_date}
                        onChange={handleInputChange}
                        error={!!errors.start_date}
                        helperText={errors.start_date}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Fecha de termino"
                        name="end_date"
                        type="date"
                        InputLabelProps={{shrink: true}}    
                        value={formValues.end_date}
                        onChange={handleInputChange}
                        error={!!errors.end_date}
                        helperText={errors.end_date}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="hora de inicio"
                        name="start_time"
                        type="time"
                        InputLabelProps={{shrink: true}}    
                        value={formValues.start_time}
                        onChange={handleInputChange}
                        error={!!errors.start_time}
                        helperText={errors.start_time}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Hora de termino"
                        name="end_time"
                        type="time"
                        InputLabelProps={{shrink: true}}    
                        value={formValues.end_time}
                        onChange={handleInputChange}
                        error={!!errors.end_time}
                        helperText={errors.end_time}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" color="success" onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>Aceptar</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
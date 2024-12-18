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
  border: '1px solid #2e7d32',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

export default function FinishOrderForm({ onOrderCreated }) {

  useEffect(() => {
    fetchOrdersToConclude();
  }, []);

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
    num_of_order: '',
    description: '',
    current_status: '',
    service: '',
    work_shift: '',
    work_worker: '',
    work_processes:'',
    need_material:'',
    assignment_date: '',
    work_end_date: '',
    received_by: '',
    delivered_by: '',
    delivery_date: now.format('YYYY-MM-DD'),
  });

  const initialFormValues = {
    id: '',
    num_of_order: '',
    description: '',
    current_status: '',
    service: '',
    worker_shift: '',
    work_worker: '',
    work_processes:'',
    need_material:'',
    assignment_date: '',
    work_end_date: '',
    received_by: '',
    delivered_by: '',
    delivery_date: now.format('YYYY-MM-DD'),
  };

const updateToUpperCase = (name, value) => {
  if (name === 'received_by' || name === 'delivered_by') {
    return value.toUpperCase();
  }
  return value;
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updateValue = updateToUpperCase(name, value)

    if (name === "num_of_order") {
      const selectedOrder = orders.find(order => order.num_of_order === value)
      if(selectedOrder){
        setFormValues({
          ...formValues,
          id: selectedOrder.id,
          num_of_order: value,
          description: selectedOrder.description,
          current_status: selectedOrder.current_status,
          service: selectedOrder.service,
          assignment_date: selectedOrder.assignment_date,
          work_end_date: selectedOrder.work_end_date,
          work_shift: selectedOrder.work_shift,
          work_worker: selectedOrder.work_worker,
          work_processes:selectedOrder.work_processes,
          need_material:selectedOrder.need_material,
        });
      }
    } else {     
      setFormValues({
        ...formValues,
        [name]: updateValue,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.num_of_order = formValues.num_of_order ? '' : 'Please enter the order to finish';
    tempErrors.received_by = formValues.received_by ? '' : 'Please indicate hwo recibe';
    tempErrors.delivered_by = formValues.delivered_by ? '' : 'Plase indicate who delivery';
    tempErrors.delivery_date = formValues.delivery_date ? '' : 'Please indicate delivery date';

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const fetchOrdersToConclude = async () => {
    try {
      const data = await apiService.get('orders/api/order_to_conclude')
      setOrders(data)
      } catch (err) {
        setError(err.message);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSend = {
        delivery_date: formValues.delivery_date,
        received_by: formValues.received_by,
        delivered_by: formValues.delivered_by
      }
      try {
          const response = await apiService.patch(`orders/api/v1/orders/${formValues.id}/`, dataToSend);
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
      <Button variant='contained' color='success' onClick={handleOpen}>Finalize Order</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>Finalize Order</div>
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
                      <InputLabel size='small' error={!!errors.num_of_order}>Order number</InputLabel>
                      <Select
                        fullWidth
                        size='small'
  
                        label="Order number"
                        name="num_of_order"
                        value={formValues.num_of_order}
                        onChange={handleInputChange}
                        error={!!errors.num_of_order}
                        >

                        {orders.map((order) => (
                          <MenuItem key={order.id} value={order.num_of_order}>
                            {order.num_of_order}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.num_of_order && (
                          <FormHelperText style={{color: 'red'}}>{errors.num_of_order}</FormHelperText> 
                        )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Description"
                        name="description"
                        disabled
                        value={formValues.description}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Status"
                        name="current_status"
                        disabled
                        value={formValues.current_status}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Service"
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
                        label="Shift"
                        name="work_shift"
                        disabled
                        value={formValues.work_shift}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Worker"
                        name="work_worker"
                        disabled
                        value={formValues.work_worker}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Proccess"
                        name="work_processes"
                        disabled
                        value={formValues.work_processes}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Material Status"
                        name="need_material"
                        disabled
                        value={formValues.need_material}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Received"
                        name="received_by"
                        value={formValues.received_by}
                        onChange={handleInputChange}
                        error={!!errors.received_by}
                        helperText={errors.received_by}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Delivery"
                        name="delivered_by"
                        value={formValues.delivered_by}
                        onChange={handleInputChange}
                        error={!!errors.delivered_by}
                        helperText={errors.delivered_by}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" color="success" onClick={handleClose}>Cancel</Button>
            <Button ype="submit" variant="contained" color="success" onClick={handleSubmit}>Accept</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
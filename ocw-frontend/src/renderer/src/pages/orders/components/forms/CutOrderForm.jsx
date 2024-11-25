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
  border: '1px solid #1565C0',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

export default function CutOrderForm({ onOrderCreated }) {

  useEffect(() => {
    fetchOrdersForCut();
  }, []);

  const timeZone = 'America/Mexico_City';
  const now = moment().tz(timeZone);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  const [formValues, setFormValues] = useState({
    order_with_area: '',
    description: '',
    num_of_pieces: '',
    num_cut_order: '',
    material_type: '',
    material_quantity: '',
    request_date: now.format('YYYY-MM-DD'),
    work_order: '',
  });

  const initialFormValues = {
    order_with_area: '',
    description: '',
    num_of_pieces: '',
    num_cut_order: '',
    material_type: '',
    material_quantity: '',
    request_date: now.format('YYYY-MM-DD'),
    work_order: '',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "order_with_area") {
      const selectedOrder = orders.find(order => order.order_with_area === value)
      if(selectedOrder){
        setFormValues({
          ...formValues,
          work_order: selectedOrder.id,
          order_with_area: value,
          description: selectedOrder.description,
          num_of_pieces: selectedOrder.num_of_pieces,
        });
      }
    } 
    else if (name === 'material_type'){
      setFormValues({
        ...formValues,
        [name]: value.toUpperCase(),
      });
      
    } else {     
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.order_with_area = formValues.order_with_area ? '' : 'Enter the order to select';
    tempErrors.num_of_pieces = formValues.num_of_pieces ? '': 'Enter the number of pieces';
    tempErrors.num_cut_order = formValues.num_cut_order ? '': 'Enter the number of cut order'; 
    tempErrors.material_type = formValues.material_type ? '' : 'Enter the material type';
    tempErrors.material_quantity = formValues.material_quantity ? '' : 'Enter the material quantity';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const fetchOrdersForCut = async () => {
    try {
      const data = await apiService.get('orders/api/orders_for_cut')
      setOrders(data)
      } catch (err) {
        setError(err.message);
      } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await apiService.post('orders/api/v1/cuts/', formValues)
          if (onOrderCreated) {
            setFormValues(initialFormValues);
            onOrderCreated(); 
          } 
      } catch (err) {
        setError(err.message);
      }
      handleClose();
    }
  };

  return (
    <div>
      <Button variant='contained' color='primary' onClick={handleOpen}>New Cut</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>New Cut</div>
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
                      <InputLabel size='small' error={!!errors.order_with_area}>Order number</InputLabel>
                      <Select
                        fullWidth
                        size='small'
                        label="Order number" 
                        name="order_with_area"
                        value={formValues.order_with_area}
                        onChange={handleInputChange}
                        error={!!errors.order_with_area}
                        >
                        {orders.map((order) => (
                          <MenuItem key={order.id} value={order.order_with_area}>
                            {order.order_with_area}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.order_with_area && (
                          <FormHelperText style={{color: 'red'}}>{errors.order_with_area}</FormHelperText> 
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
                        label="No. of pieces"
                        name="num_of_pieces"
                        type="number"
                        disabled
                        value={formValues.num_of_pieces}
                        onChange={handleInputChange}
                        error={!!errors.num_of_pieces}
                        helperText={errors.num_of_pieces}
                      />
                    </Grid>
                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        size='small'
                        label="Cutting order number"
                        name="num_cut_order"
                        type='number'
                        inputProps={{ min: "0", step: "1" }}
                        value={formValues.num_cut_order}
                        onChange={handleInputChange}
                        error={!!errors.num_cut_order}
                        helperText={errors.num_cut_order}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Material type"
                        name="material_type"
                        value={formValues.material_type}
                        onChange={handleInputChange}
                        error={!!errors.material_type}
                        helperText={errors.material_type}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Material quantity"
                        name="material_quantity"
                        inputProps={{ min: "0", step: "1" }}
                        value={formValues.material_quantity}
                        onChange={handleInputChange}
                        error={!!errors.material_quantity}
                        helperText={errors.material_quantity}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button ype="submit" variant="contained" color="primary" onClick={handleSubmit}>Accept</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
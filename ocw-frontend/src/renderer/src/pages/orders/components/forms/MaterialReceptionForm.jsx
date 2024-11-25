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

export default function MaterialReceptionForm({ onOrderCreated, refreshTrigger }) {

  useEffect(() => {
      fetchOrdersForMaterialReception();
    }, 
    [refreshTrigger]
  );

  const timeZone = 'America/Mexico_City';
  const now = moment().tz(timeZone);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  const [formValues, setFormValues] = useState({
    id: '',
    work_order: '',
    num_cut_order: '',
    order_with_area: '',
    num_pieces: '',
    material_type: '',
    material_quantity: '',
    request_date: '',
    material_weight: '',
    observation: '',
    delivery_date: now.format('YYYY-MM-DD')
  });

  const initialFormValues = {
    id: '',
    work_order: '',
    num_cut_order: '',
    order_with_area: '',
    num_pieces: '',
    material_type: '',
    material_quantity: '',
    request_date: '',
    material_weight: '',
    observation: '',
    delivery_date: now.format('YYYY-MM-DD')
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.num_cut_order = formValues.num_cut_order ? '' : 'Please enter the cutting order number';
    tempErrors.material_weight = formValues.material_weight ? '' : 'Material weight is reuqired';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const fetchOrdersForMaterialReception = async () => {
    try {
      const data = await apiService.get('orders/api/mat_for_deli')
      setOrders(data)
      } catch (err) {
        setError(err.message);
      } 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "num_cut_order") {
      const selectedOrder = orders.find(order => order.num_cut_order === value)
      if(selectedOrder){
        setFormValues({
          ...formValues,
          id: selectedOrder.id,
          work_order: selectedOrder.work_order,
          num_cut_order: value,
          order_with_area: selectedOrder.order_with_area,
          num_pieces: selectedOrder.num_pieces,
          material_type: selectedOrder.material_type,
          material_quantity: selectedOrder.material_quantity,
          request_date: selectedOrder.request_date,
        });
      }
    } else {     
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await apiService.patch(`orders/api/v1/cuts/${formValues.id}/`, formValues)
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
      <Button variant='contained' color='success' onClick={handleOpen}>Material reception</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>Material reception</div>
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
                      <InputLabel size='small' error={!!errors.num_cut_order}>Cutting order number</InputLabel>
                        <Select
                          fullWidth
                          size='small'
                          label="Cutting order number"
                          name="num_cut_order"
                          value={formValues.num_cut_order}
                          onChange={handleInputChange}
                          error={!!errors.num_cut_order}                          >
                          {orders.map((order) => (
                            <MenuItem key={order.id} value={order.num_cut_order}>
                              {order.num_cut_order}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.num_cut_order && (
                          <FormHelperText style={{color: 'red'}}>{errors.num_cut_order}</FormHelperText> 
                        )}
                    </Grid>
                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        size='small'
                        label="Order number"
                        name="order_with_area"
                        disabled
                        value={formValues.order_with_area}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="No. of pieces"
                        name="num_pieces"
                        type='number'
                        disabled
                        value={formValues.num_pieces}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Material type"
                        name="material_type"
                        disabled
                        value={formValues.material_type}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Material quantity"
                        name="material_quantity"
                        disabled
                        value={formValues.material_quantity}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Material weight"
                        name="material_weight"
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        value={formValues.material_weight}
                        onChange={handleInputChange}
                        error={!!errors.material_weight}
                        helperText={errors.material_weight}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Observations"
                        name="observation"
                        value={formValues.observation}
                        onChange={handleInputChange}
                        helperText={errors.observation}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" color="success" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>Accept</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
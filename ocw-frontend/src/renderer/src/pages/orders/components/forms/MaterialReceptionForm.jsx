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
    tempErrors.num_cut_order = formValues.num_cut_order ? '' : 'Favor de seleccionar una orden de corte';
    tempErrors.material_weight = formValues.material_weight ? '' : 'Es requerido el peso del material';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const fetchOrdersForMaterialReception = async () => {
    try {
      const data = await apiService.get('/mat_for_deli');
      console.log('for marterial reception loaded:', data);
      setOrders(data)
      } catch (err) {
        setError(err.message);
        console.error('failed to load marterial reception orders:',err);
      } finally {
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
      console.log('Form submitted successfully', formValues);
      try {
          const response = await apiService.patch(`v1/cuts/${formValues.id}/`, formValues);
          console.log('Reception material order created:', response)
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
      <Button variant='contained' color='success' onClick={handleOpen}>Recepcion de Material</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>Recepcion de Material</div>
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
                      <InputLabel size='small' error={!!errors.num_cut_order}>No. de orden de corte</InputLabel>
                        <Select
                          fullWidth
                          size='small'
                          label="No. de orden de corte"
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
                        label="No. de orden"
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
                        label="No. de piezas"
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
                        label="Tipo de material"
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
                        label="Cantidad de material"
                        name="material_quantity"
                        disabled
                        value={formValues.material_quantity}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Peso del material"
                        name="material_weight"
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        value={formValues.material_weight}
                        onChange={handleInputChange}
                        error={!!errors.material_weight}
                        helperText={errors.material_weight}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth size='small'>
                        <InputLabel id="priority">Unidad</InputLabel>
                        <Select
                          label="Unidad"
                          name='priority'
                          value={formValues.priority}
                          onChange={handleInputChange}
                          error={!!errors.priority}
                        >
                          <MenuItem value="1">G</MenuItem>
                          <MenuItem value="2">KG</MenuItem>
                          <MenuItem value="3">LB</MenuItem>
                        </Select>
                        {<FormHelperText style={{color:'red'}}>{errors.priority}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Observaciones"
                        name="observation"
                        value={formValues.observation}
                        onChange={handleInputChange}
                        helperText={errors.observation}
                      />
                    </Grid>
                    {/* <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Fecha de solicitud"
                        name="request_date"
                        type="date"
                        disabled
                        InputLabelProps={{shrink: true}}                        
                        value={formValues.request_date}
                        onChange={handleInputChange}
                      />
                    </Grid> */}
                    {/* <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Fecha de entrega"
                        name="delivery_date"
                        type="date"
                        disabled
                        value={formValues.delivery_date}
                        onChange={handleInputChange}
                        error={!!errors.delivery_date}
                        helperText={errors.delivery_date}
                      />
                    </Grid> */}
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
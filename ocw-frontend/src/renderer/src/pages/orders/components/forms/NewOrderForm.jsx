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
    tempErrors.num_of_order = formValues.num_of_order ? '' : 'Number of order is required';
    tempErrors.description = formValues.description ? '' : 'Please add a description';
    tempErrors.area = formValues.area ? '' : 'Applicant area is required';
    tempErrors.carried_by = formValues.carried_by ? '' : 'Person delivery is required';
    tempErrors.authorized_by = formValues.authorized_by ? '' : 'Authorizing person is reuqired';
    tempErrors.num_of_pieces = formValues.num_of_pieces ? '': 'Enter the number of pieces'; 
    tempErrors.priority = formValues.priority ? '' : 'Assing the order priority';
    tempErrors.service = formValues.service ? '' : 'Assign the service';
    tempErrors.assignment_date = formValues.assignment_date ? '' : 'Enter the start date'; 
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await apiService.post('orders/api/v1/orders/', formValues)
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
      <Button variant='contained' onClick={handleOpen}>New Order</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>New Order</div>
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
                        label="Order number"
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
                        label="Description"
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
                        label="Soliciting area"
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
                        label="Delivery"
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
                        label="Authorizes"
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
                        label="No. of pieces"
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
                        <InputLabel id="priority">Priority</InputLabel>
                        <Select
                          label="Priority"
                          name='priority'
                          value={formValues.priority}
                          onChange={handleInputChange}
                          error={!!errors.priority}
                        >
                          <MenuItem value="1">Urgent | 1d</MenuItem>
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
                        <InputLabel id="service">services</InputLabel>
                        <Select
                          label="Service"
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
                          <MenuItem value="3">Repair</MenuItem>
                          <MenuItem value="2">Manufacturing</MenuItem>
                          <MenuItem value="1">Grinding</MenuItem>
                          <MenuItem value="4">Manufacturing Stock</MenuItem>
                          <MenuItem value="5">Repair Stock</MenuItem>
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
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Accept</Button>
          </footer>
        </Box>
      </Modal>
    </div>
  );
}
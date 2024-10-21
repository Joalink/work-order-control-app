import * as React from 'react';
import Modal from '@mui/material/Modal';
import { X, Plus } from 'react-feather';
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
import AddOperatorForm from './AddOperatorForm';
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

export default function AsssigWorkForm({ onOrderCreated}) {

  useEffect(() => {
    fetchOrdersForProcess();
    console.log("operator called",fetchOrdersForProcess)
  }, []);



  const timeZone = 'America/Mexico_City';
  const now = moment().tz(timeZone);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const [formValues, setFormValues] = useState({
    id: '',
    order_with_area: '',
    description: '',
    service: '',
    assignment_date: '',
    shift_id: '',
    name: '',
    shift_workers: [],
    worker_id: '',
    full_name: '',
    shift: '',
    work_processes: '',

  });

  const initialFormValues = {
    id: '',
    order_with_area: '',
    description: '',
    service: '',
    assignment_date: '',
    shift_id: '',
    name: '',
    shift_workers: [],
    worker_id: '',
    full_name: '',
    shift: '',
    work_processes: '',
  };


  const validate = () => {
    let tempErrors = {};
    tempErrors.order_with_area = formValues.order_with_area ? '' : 'Ingrese la orden a seleccionar';
    tempErrors.name = formValues.name ? '' : 'Ingrese el turno a seleccionar';
    tempErrors.full_name = formValues.full_name ? '' : 'Ingrese el operador a asignar';
    tempErrors.work_processes = formValues.work_processes ? '' : 'Ingrese el proceso a realizar';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleOperatorCreated = async () => {
    await fetchOrdersForProcess();
  };

  const handleCloseModal = () => {
    setModalOpen(false)
    console.log("modal close")
    handleOperatorCreated();

    setFormValues(prevValues => ({
      ...prevValues,
      name: '', // Vaciar el campo de turno
      shift_workers: [], // Vaciar la lista de operadores
    }));

    // Volver a seleccionar el turno después de un breve retraso
    setTimeout(() => {
      const selectedShift = shifts.find(shift => shift.id === selectedShift);
      if (selectedShift) {
        setFormValues(prevValues => ({
          ...prevValues,
          name: selectedShift.name, // Volver a seleccionar el turno
          shift_workers: selectedShift.shift_workers || [],
        }));
      }
    }, 0);
  }

  const fetchOrdersForProcess = async () => {
    console.log('execute fetch orders')
    try {
      const data = await apiService.get('/work_to_assign');
      const {orders, shift_workers} = data;
      setOrders(orders);
      setShifts(shift_workers);
      } catch (err) {
        setError(err.message);
        console.error('failed to load cut orders:',err);
      }
  };

  const handleOpenModal = () => {
    setModalOpen(true)
    setSelectedShift(formValues.shift_id)
    
  }; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "order_with_area") {
      const selectedOrder = orders.find(order => order.order_with_area === value);
      if (selectedOrder) {
        setFormValues({
          ...formValues,
          id: selectedOrder.id,
          order_with_area: value,
          description: selectedOrder.description,
          service: selectedOrder.service,
          assignment_date: selectedOrder.assignment_date,
        });
      }
    } else if (name === 'name') {
      const selectedShift = shifts.find(shift => shift.name === value);
      if (selectedShift) {
        setFormValues({
          ...formValues,
          shift_id: selectedShift.id,
          name: value,
          shift_workers: selectedShift.shift_workers || []
        });
      }
    } else {     
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleWorkerChange = (e) => {
    const {value} = e.target;
    const selectedWorker = formValues.shift_workers.find(worker => worker.full_name === value);
    if(selectedWorker){
      setFormValues({
        ...formValues,
        full_name: value,
        worker_id: selectedWorker.id
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await apiService.post('v1/works/', 
            {
              work_processes: formValues.work_processes,
              work_order: formValues.id,
              shift: formValues.shift_id,
              operator: formValues.worker_id,
            },
          );
          console.log('Cut Order created:', response)

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
    } else {
      console.log('Na validate')
    }

    useEffect(() => {
      if (formValues.order_with_area) {
        const selectedOrder = orders.find(order => order.order_with_area === formValues.order_with_area);
        if (selectedOrder) {
          setFormValues(prevValues => ({
            ...prevValues,
            id: selectedOrder.id,
            description: selectedOrder.description,
            service: selectedOrder.service,
            assignment_date: selectedOrder.assignment_date,
          }));
        }
      }
    }, [orders]);
  
    useEffect(() => {
      if (formValues.name) {
        const selectedShift = shifts.find(shift => shift.name === formValues.name);
        if (selectedShift) {
          setFormValues(prevValues => ({
            ...prevValues,
            shift_id: selectedShift.id,
            shift_workers: selectedShift.shift_workers || []
          }));
        }
      }
    }, [shifts]);
  

  };

  return (
    <div>
      <Button variant='contained' color='primary' onClick={handleOpen}>Asignar Trabajo</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className='flex justify-between align-center'>
            <div className='flex items-center text-neutral-500 font-semibold'>Asignar Trabajo</div>
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
                      <FormControl fullWidth size='small' error={!!errors.order_with_area}>
                        <InputLabel>No. de orden</InputLabel>
                        <Select
                          fullWidth
                          size='small'
                          label="No. de orden"
                          name="order_with_area"
                          value={formValues.order_with_area}
                          onChange={handleInputChange}
                        >
                          {orders.map((order) => (
                            <MenuItem key={order.id} value={order.order_with_area}>
                              {order.order_with_area}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.order_with_area && (
                          <FormHelperText style={{ color: 'red' }}>{errors.order_with_area}</FormHelperText>
                        )}
                      </FormControl>
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
                        error={!!errors.description}
                        helperText={errors.description}
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
                        error={!!errors.service}
                        helperText={errors.service}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size='small' error={!!errors.name}>
                        <InputLabel>Turno</InputLabel>
                        <Select
                          fullWidth
                          size='small'
                          label="Turno"
                          name="name"
                          value={formValues.name}
                          onChange={handleInputChange}
                        >
                          {shifts.map((shift) => (
                            <MenuItem key={shift.id} value={shift.name}>
                              {shift.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.name && (
                          <FormHelperText style={{ color: 'red' }}>{errors.name}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={10}>
                      <FormControl fullWidth size='small' error={!!errors.full_name}>
                        <InputLabel
                          disabled={!formValues.name}
                          >
                            Operador
                        </InputLabel>
                        <Select
                          fullWidth
                          size='small'
                          label="Operador"
                          name="full_name"
                          disabled={!formValues.name}
                          value={formValues.full_name}
                          onChange={handleWorkerChange}
                        >
                          {formValues.shift_workers.map((worker) => (
                            <MenuItem key={worker.id} value={worker.full_name}>
                              {worker.full_name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.full_name && (
                          <FormHelperText style={{ color: 'red' }}>{errors.full_name}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <Button 
                      variant='contained' 
                      color='success'
                      disabled={!formValues.name}
                      onClick={handleOpenModal}
                      >
                        <Plus></Plus>
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label="Proceso a realizar"
                        name="work_processes"
                        type="work_processes"
                        value={formValues.work_processes}
                        onChange={handleInputChange}
                        error={!!errors.work_processes}
                        helperText={errors.work_processes}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>
          </body>
          <footer className='flex justify-end items-center gap-4'>
            <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
            <Button ype="submit" variant="contained" color="primary" onClick={handleSubmit}>Aceptar</Button>
          </footer>
        </Box>
      </Modal>

      {modalOpen && (
      <AddOperatorForm
        open={modalOpen}
        onClose={handleCloseModal}
        selectedShift={selectedShift}
        onOperatorCreated={handleOperatorCreated}  // Pass the function as a prop
      />
    )}
    </div>
  );
}
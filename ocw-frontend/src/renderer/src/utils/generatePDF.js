import { jsPDF } from 'jspdf';

const convertToArray = (data) => {
  const processObject = (obj, parentKey = '') => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return processObject(value, newKey)
      }
      return { field: newKey, value }
    })
  }
  let mainData = {}
  let cutOrdersData = []
  if (data.cut_orders) {
    cutOrdersData = Array.isArray(data.cut_orders) ? data.cut_orders : [data.cut_orders] 
    delete data.cut_orders 
  }
  mainData = processObject(data) 
  return { mainData, cutOrdersData } 
}

export const generatePDF = (data) => {
  const doc = new jsPDF()

  doc.setFont('Georgia', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text('Grupo Reyma', 50, 10, { align: 'left' })
  doc.text('Lunes, 5 marzo del 2025', 50, 20, { align: 'left' })
  doc.text('Leon, Guanajuato', 50, 30, { align: 'left' })
  doc.setDrawColor(40)
  doc.line(10, 35, 200, 35)
  let y = 45

  const { mainData, cutOrdersData } = convertToArray(data)
  
  const labelMap = {
  num_of_order: 'Order Number',
  area: 'Requesting Area',
  description: 'Description',
  carried_by: 'Delivered By',
  authorized_by: 'Authorized By',
  num_of_pieces: 'Number of Pieces',
  assignment_date: 'Assignment Date',
  priority_num: 'Priority',
  service_type: 'Service Type',
  need_material: 'Material',
  'assigned_work.shift_name': 'Shift',
  'assigned_work.operator_full_name': 'Operator',
  'assigned_work.work_processes': 'Processes Performed',
  'assigned_work.start_date': 'Work Start Date',
  'assigned_work.end_date': 'Work End Date',
  'assigned_work.total_days': 'Total Days',
  delivery_date: 'Delivery Date',
  received_by: 'Received By',
  delivered_by: 'Delivered By'
  }

  const labelMapCutOrders = {
    num_cut_order: 'Cut Order Number',
    material_type: 'Material Type',
    material_quantity: 'Material Quantity',
    request_date: 'Request Date',
    delivery_date: 'Delivery Date',
    material_weight: 'Material Weight',
    observations: 'Observations'
  }


  doc.setFont('Georgia', 'normal')
  doc.setFontSize(10)

  for (const key in labelMap) {
    if (labelMap.hasOwnProperty(key)) {
      const label = labelMap[key]
      const value = mainData.find((item) => item.field === key)?.value

      if (value !== undefined) {
        doc.setFont('Georgia', 'bold')
        doc.text(`${label}:`, 10, y)
        doc.setFont('Georgia', 'normal')
        doc.text(`${value}`, 50, y)
        y += 10
      }
    }

    if (y > 280) {
      doc.addPage()
      y = 10
    }
  }

  if (cutOrdersData.length > 0) {
    y += 10 /
    doc.setFont('Georgia', 'bold')
    doc.setFontSize(14)
    doc.text('Órdenes de Corte', 10, y) 
    y += 10

    cutOrdersData.forEach((order, index) => {
      const orderArray = (() => {
        const processObject = (obj, parentKey = '') => {
          return Object.entries(obj).map(([key, value]) => ({
            field: parentKey ? `${parentKey}.${key}` : key,
            value
          }))
        }
        return processObject(order)
      })()

      orderArray.forEach(({ field, value }) => {
        const cleanField = field.split('.').pop() 
        const label = labelMapCutOrders[cleanField] || cleanField 
        doc.setFontSize(10)
        doc.setFont('Georgia', 'bold')
        doc.text(`${label}:`, 10, y)
        doc.setFont('Georgia', 'normal')
        doc.text(`${value}`, 50, y)
        y += 10
        if (y > 280) {
          doc.addPage()
          y = 10
        }
      })
    })
  }

  const numOfOrder = mainData.find((item) => item.field === 'num_of_order')?.value
  const area = mainData.find((item) => item.field === 'area')?.value
  const deliveredDate = mainData.find((item) => item.field === 'delivery_date')?.value
  doc.save(`${numOfOrder}_${area}_${deliveredDate}.pdf`)
}

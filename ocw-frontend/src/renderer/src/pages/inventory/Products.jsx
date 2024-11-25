import React, {useState} from 'react'
import ProductsTable from './components/Tables/ProductsTable'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'
import DeleteProduct from './components/DeleteProduct'

export default function Products() {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isEditOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const triggerTableRefresh = () => { setRefreshTrigger((prev) => prev + 1) }

  const handleEdit = (id) => {
    setEditId(id);
    setEditOpen(true);
  }

  const handleEditClose = () => setEditOpen(false);

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  }

  const handleDeleteClose = () => setIsDeleteOpen(false);

  return (
    <>
      <div className="flex flex-col justify-center w-[98%] pt-2 mx-auto ">
        <div className="flex flex-row justify-evenly ">
          <AddProduct
            open={open}
            onClose={handleClose}
            onOrderCreated={triggerTableRefresh}
          ></AddProduct>
        </div>
        <div className="flex py-2">
          <ProductsTable
            refreshTrigger={refreshTrigger}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          ></ProductsTable>
        </div>
      </div>
      <EditProduct
        open={isEditOpen}
        onClose={handleEditClose}
        onEdit={triggerTableRefresh}
        id={editId}
      ></EditProduct>
      <DeleteProduct
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onDelete={triggerTableRefresh}
        id={deleteId}
      ></DeleteProduct>
    </>
  )
}

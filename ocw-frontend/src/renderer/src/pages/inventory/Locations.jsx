import React, {useState} from 'react'
import LocationsTable from './components/Tables/LocationsTable'
import AddLocation from './components/AddLocation'
import EditLocation from './components/EditLocation'
import DeleteLocation from './components/DeleteLocation'

export default function Locations() {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isEditOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const triggerTableRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEdit = (id) => {
    setEditId(id)
    setEditOpen(true)
  }

  const handleEditClose = () => setEditOpen(false)

  const handleDelete = (id) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const handleDeleteClose = () => setIsDeleteOpen(false)

  return (
    <>
      <div className="flex flex-col justify-center w-[98%] pt-2 mx-auto ">
        <div className="flex flex-row justify-evenly ">
          <AddLocation
            open={open}
            onClose={handleClose}
            onOrderCreated={triggerTableRefresh}
          ></AddLocation>
        </div>
        <div className="flex py-2">
          <LocationsTable
            refreshTrigger={refreshTrigger}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          ></LocationsTable>
        </div>
      </div>
      <EditLocation
        open={isEditOpen}
        onClose={handleEditClose}
        onEdit={triggerTableRefresh}
        id={editId}
      ></EditLocation>
      <DeleteLocation
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onDelete={triggerTableRefresh}
        id={deleteId}
      ></DeleteLocation>
    </>
  )
}

import React, { useState } from 'react'
import StockTable from './components/Tables/StockTable'
import AddStock from './components/AddStock'
import DeleteStock from './components/DeleteStock'
import CreateMovement from './components/CreateMovement'
import EditStock from './components/EditStock'

export default function Stock() {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [isMovementOpen, setIsMovementOpen] = useState(false)
  const [movementId, setMovementId] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const triggerTableRefresh = () => { setRefreshTrigger((prev) => prev + 1) }

  const handleEdit = (id) => {
    setEditId(id)
    setIsEditOpen(true)
  }
  const handleMovement = (id) => {
    setMovementId(id)
    setIsMovementOpen(true)
  }
  const handleDelete = (id) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const handleMovementClose = () => setIsMovementOpen(false)
  const handleEditClose = () => setIsEditOpen(false)
  const handleDeleteClose = () => setIsDeleteOpen(false)



  return (
    <>
      <div className="flex flex-col justify-center w-[98%] pt-2 mx-auto ">
        <div className="flex flex-row justify-evenly ">
          <AddStock open={open} onClose={handleClose} onCreated={triggerTableRefresh}></AddStock>
        </div>
        <div className="flex py-2">
          <StockTable
            refreshTrigger={refreshTrigger}
            handleEdit={handleEdit}
            handleMovement={handleMovement}
            handleDelete={handleDelete}
          ></StockTable>
        </div>
      </div>
      <EditStock
        open={isEditOpen}
        onClose={handleEditClose}
        onEdit={triggerTableRefresh}
        id={editId}
      ></EditStock>
      <CreateMovement
        open={isMovementOpen}
        onClose={handleMovementClose}
        onCreated={triggerTableRefresh}
        id={movementId}
      ></CreateMovement>
      <DeleteStock
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onDelete={triggerTableRefresh}
        id={deleteId}
      ></DeleteStock>
    </>
  )
}

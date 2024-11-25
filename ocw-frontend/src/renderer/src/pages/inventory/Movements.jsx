import React from 'react'
import MovementsTable from './components/Tables/MovementTable'
import ExportExcel from './components/ExportExcel'

export default function Movements() {
  return (
    <>
      <div className="flex flex-col justify-center w-[98%] pt-2 mx-auto ">
        <div className="flex flex-row justify-evenly ">
          <ExportExcel></ExportExcel>
        </div>
        <div className="flex py-2">
          <MovementsTable></MovementsTable>
        </div>
      </div>
    </>
  )
}

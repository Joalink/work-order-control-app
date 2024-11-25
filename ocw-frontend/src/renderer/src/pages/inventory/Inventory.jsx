import React, {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router-dom'

export default function Inventory() {
    const [title, setTitle] = useState('')
    const [activeButton, setActiveButton] = useState(null)

    const handleToLocations = () => {
      setActiveButton('locations')
      setTitle('Locations')
    }

    const handleToProducts = () => {
      setActiveButton('products')
      setTitle('Products')
    }

    const handleToMovements = () => {
      setActiveButton('movements')
      setTitle('Movements')
    } 

    const handleToStock = () => {
      setActiveButton('stock')
      setTitle('Stock')
    }

    const buttons = [
      {
        text: 'Stock',
        route: 'stock',
        active: activeButton === 'stock',
        onClick: handleToStock
      },
      {
        text: 'Products',
        route: 'products',
        active: activeButton === 'products',
        onClick: handleToProducts
      },
      {
        text: 'Locations',
        route: 'locations',
        active: activeButton === 'locations',
        onClick: handleToLocations
      },
      {
        text: 'Movements',
        route: 'movements',
        active: activeButton === 'movements',
        onClick: handleToMovements
      }
    ]
    
  return (
    <>
      <Navbar tittle={title} buttons={buttons}></Navbar>
      <Outlet/>
    </>
  )
}

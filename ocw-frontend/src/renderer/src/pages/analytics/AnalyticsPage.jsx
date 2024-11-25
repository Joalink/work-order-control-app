import React from 'react'
import Navbar from '../../components/Navbar';
import Calculator from './components/Calculator';

export default function AnalyticsPage() {
  return (
    <>
      <Navbar tittle={'Finances'}></Navbar>
      <Calculator></Calculator>
    </>
  )
}

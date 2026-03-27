/**
 * Frame.jsx
 */


import { Outlet } from 'react-router-dom'
import Growler from './Growler'


export default function Frame() {


  return (
    <>
      <Outlet />
      <Growler />
    </>
  )
}
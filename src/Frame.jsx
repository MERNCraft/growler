/**
 * Frame.jsx
 */


import { Outlet } from 'react-router-dom'
import Growler from './Growler'
import RouteSwitcher from './RouteSwitcher'


export default function Frame() {
  return (
    <>
      <Outlet />
      <RouteSwitcher />
      <Growler />
    </>
  )
}
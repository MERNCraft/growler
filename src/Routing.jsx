/**
 * src/Routing.jsx
 */


import { useContext, useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { RouteContext } from './RouteContext';
import Frame from './Frame';
import StartGrowl from './StartGrowl';
import Page2 from './Page2';


export default function Routing() {
  const { route } = useContext(RouteContext)

  return (
    <Routes
      key={route}
    >
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Frame />} >
        <Route index element={<StartGrowl />} />
        <Route path="page2" element={<Page2 />} />
      {/* REDIRECT FOR UNLISTED PUBLIC PATHS */}
      <Route path="*" element={
        <Navigate
          to="/#?"
          replace={true}
        />}
      />
      </Route>
    </Routes>
  )
}
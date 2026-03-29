/**
 * src/RouteContext.jsx
 *
 * description
 */


import React, { createContext, useState } from 'react'


export const RouteContext = createContext()


export const RouteProvider = ({ children }) => {
  const [ route, setRoute ] = useState("default")

  return (
    <RouteContext.Provider
      value ={{
        route,
        setRoute
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}
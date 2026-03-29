/**
 * src/RouteSwitcher.jsx
 */


import { useContext} from 'react'
import { RouteContext } from './RouteContext'


export default function RouteSwitcher(props) {
  const { setRoute } = useContext(RouteContext)


  const forceRemount = () => {
    const randomRoute = Array
      .from({ length: 8 })
      .map(() => (
        Number(Math.floor(Math.random() * 16))).toString(16)
      )
      .join("")
    setRoute(randomRoute)
  }


  return (
    <button
      onClick={forceRemount}
    >
      Force Remount
    </button>
  )
}
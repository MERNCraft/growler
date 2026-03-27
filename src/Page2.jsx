/**
 * Page1.jsx
 */


import { Link } from 'react-router-dom'


export default function Page2() {

  return (
    <>
      <h1>Page Two</h1>
      <div>
        <Link to="/">Back to Main Page</Link>
      </div>
    </>

  )
}
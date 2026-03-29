/**
 * StartGrowl.jsx
 */


import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { GrowlContext } from './GrowlContext'


export default function StartGrowl() {
  const [ message, setMessage ] = useState(
    "<h3>Text with markup and <a href='#/page2'>Link</a></h3>"
  )

    // "Growl Text can contain <a href='https://MERNCraft.github.io/'>Links</a>"
  const [ delay, setDelay ] = useState(5000)
  const { newGrowl, closeGrowl } = useContext(GrowlContext)
  const [ open, setOpen ] = useState([])


  const updateMessage = ({ target }) => {
    setMessage(target.value)
  }


  const updateDelay = ({ target }) => {
    setDelay(Number(target.value))
  }


  const createGrowl = event => {
    event.preventDefault()

    const index = newGrowl({
      message,
      delay
    })
    setOpen(current => [...current, index])
  }


  const createDangerousGrowl = () => {
    const message = { __html: `
      <button
        onclick="alert('Running Code')"
        style="margin: 1.75em 3em; padding: 0.5em 1em;"
      >
        Run Possibly Dangerous Code
      </button>` }
    const index = newGrowl({
      message,
      delay
    })
    setOpen(current => [...current, index])
  }


  const forceClose = ({ target }) => {
    const index = Number(target.dataset.index)
    closeGrowl(index)
    setOpen(current => current.filter( value => value !== index))
  }


  const indices = open.map( index => (
    <div
      key={index}
    >
      <button
        onClick={forceClose}
        data-index={index}
      >
        Close Growl {index}
      </button>
    </div>
  ))


  return (
    <div className="start-growl">
      <span />
      <form>
        <div>
          <span>Message:</span>
          <input
            type="text"
            onChange={updateMessage}
            value={message}
          />
        </div>
        <p>Use a Delay of 0, to create a growl that stays open until manually closed. Use a positive number to create a growl that will close automatically after than number of millisecond. A minimum delay of 1000 ms is applied. For delays of 6 seconds and more, a Close Button will be added, so the end-user can close the growl manually.</p>
        <div>
          <span>Delay:</span>
          <input
            type="text"
            onChange={updateDelay}
            value={delay}
          />
        </div>
        <button
          className="primary"
          onClick={createGrowl}
        >
          Create New Growl
        </button>
        <button
          className="danger"
          onClick={createDangerousGrowl}
        >
          Create Dangerous Growl
        </button>
      </form>
      <div className="open">
        <h3>For demonstration only:</h3>
        <p>Growls that were closed manually and automatically will remain here, but clicking on their buttons will have no bad effects. The list below is reset when the page is re-opened.</p>
        <hr />
        <div className="growls">{indices}</div>
      </div>
      <div>
        <p>Growls are visible over all other content.<br/>Visit <Link to="page2">Page 2</Link> to see this.<br/>
        (The list above will be cleared.)</p>
      </div>
    </div>

  )
}
/**
 * StartGrowl.jsx
 */


import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { GrowlContext } from './GrowlContext'
import RouteSwitcher from './RouteSwitcher'


const DELAY = 2000


export default function StartGrowl() {
  const [ message, setMessage ] = useState(
    "<h3>Text with markup and <a href='#/page2'>Link</a></h3>"
  )

    // "Growl Text can contain <a href='https://MERNCraft.github.io/'>Links</a>"
  const [ delay, setDelay ] = useState(DELAY)
  const {
    growls,
    newGrowl,
    dismissGrowl
  } = useContext(GrowlContext)


  const updateMessage = ({ target }) => {
    setMessage(target.value)
  }


  const updateDelay = ({ target }) => {
    setDelay(Number(target.value))
  }


  const createGrowl = event => {
    event.preventDefault()

    newGrowl({
      message,
      delay
    })
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
      delay: 0
    })
  }


  const forceClose = ({ target }) => {
    const index = Number(target.dataset.index)
    dismissGrowl(index)
  }


  const closebuttons = growls.map(({ index }) => (
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
      <RouteSwitcher />
      <div className="open">
        <ul class="info">
          <li>Use a Delay of 0, to create a growl that stays open until manually closed. </li>
          <li>Use a positive number to create a growl that will close automatically after than number of millisecond.</li>
          <li>A minimum delay of 1000 ms is applied.</li>
          <li>For delays of 6 seconds and more, a Close Button will be added, so the end-user can close the growl manually.</li>
          </ul>
        <hr />
        <div className="growls">{closebuttons}</div>
      </div>
      <div>
        <p>Growls are visible over all other content. Visit <Link to="page2">Page 2</Link> to see this.</p>
      </div>
    </div>

  )
}
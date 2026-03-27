/**
 * Growler.jsx
 *
 * A growl has the format:
 *   {
 *     message: <string || {__html: "HTML markup string"},
 *     delay: <integer milliseconds>,
 *     index: <incrementing integer>
 *   }
 *
 * Animation of growls is triggered by a CSS transition. By default
 * a growl has an absolute left value of 100vw, which places it
 * just off-stage to the right. It also has a transform of
 * translate(0%), which has no effect.
 *
 * Immediately after a growl is first shown, it is given an
 * "active" class, which sets its transform to translate((-100%).
 * This moves it entirely onto the page. The use of a transition
 * means the DOM element slides in from the right.
 *
 * When the growl's time is up, or when you click on the close
 * button, the "active" class is removed, and the transition plays
 * in reverse. When it is complete, the class "shrink" is added,
 * to reduce the height of the off-screen growl to zero. This makes
 * any later growls slide up the screen.
 *
 * When the "shrink" animation is complete, the growl is removed
 * from activeGrowls, and so it is taken from the DOM.
 */


import { useRef, useState, useEffect, useContext } from 'react'
import { GrowlContext } from './GrowlContext'


export default function Growler() {
  const { growl, close } = useContext(GrowlContext)
  // { message: <string>, delay: <integer>, index: <integer>}
  const growlRef = useRef()   // creates pointer to div#growls
  const indexRef = useRef(-1) // checks for duplicate growls
  const [ latest, setLatest ] = useState() // used to add "active"
  const [ activeGrowls, setActiveGrowls ] = useState([])


  const showGrowl = () => {
    // Prevent StrictMode from showing multiple growls
    if (!growl || growl?.index === indexRef.current) { return }

    if (growl.delay) {
      // Hide the growl automatically after the delay. The 0 is
      // there to make room for the event argument in hideGrowl.
      setTimeout(hideGrowl, growl.delay, 0, growl.index)
    }

    indexRef.current = growl.index
    setLatest(growl.index) // to add the "active" class in a moment
    setActiveGrowls(current => [...current, growl])
  }


  const activate = () => {
    // Add the "active" class after the element has been added to
    // the DOM, to make it transition in from the right.
    const dataIndex = `[data-index="${latest}"]`
    const growlP = growlRef.current.querySelector(dataIndex)

    // Without a timeout, the new element may appear immediately
    // with the "active" class, and the transition will not run.
    setTimeout(() => growlP?.classList.add("active"), 100)
  }


  const hideGrowl = (event, index ) => {
    if (event) {
      // Calculate index from which growl's button was clicked
      index = event.target.closest("p").dataset.index
    }

    // Find the DOM element...
    const dataIndex = `[data-index="${index}"]`
    const growlP = growlRef.current.querySelector(dataIndex)
    // ... and remove the class that sets its transform.
    growlP?.classList.remove("active")
  }


  const moveGrowl = ({ target }) => {
    const { className } = target // "active", null, "shrink"

    if (!className) {
      // The "active" class has been removed: slide the growl away
      target.classList.add("shrink")

    } else if (className === "shrink") {
      // The growl is off-screen, and now has a height of 0px.
      // Remove the growl object from activeGrowls, which removes
      // the growl element from the DOM.
      const index = Number(target.dataset.index)

      setActiveGrowls(current  => (
        current.filter( growl => growl.index !== index)
      ))
    }
  }


  const closeGrowl = () => {
    if (!close) { return }
    hideGrowl(0, close)
  }

  // Trigger effects when a new growl is detected...
  useEffect(showGrowl, [growl?.index])
  // ... when a new request to force close a growl is detected...
  useEffect(closeGrowl, [close])
  // ... and to add the "active" class immediately after a new
  // a new growl has been added to the DOM
  useEffect(activate, [latest])


  const growls = activeGrowls.map(({ message, delay, index }) => {
    // Choose between an HTML child or plain text.
    const span = message.__html
      ? <span dangerouslySetInnerHTML={message} />
      : <span>{message}</span>

    return (
    <p
        key={index}
        data-index={index}
        data-delay={delay}
        onTransitionEnd={moveGrowl}
      >
        {(!delay || delay > 5555) &&
          < button
            onClick={hideGrowl}
          >
            ✕
          </button>
        }
        {span}
      </p>
    )
  })


  return (
    <div
      id="growls" // You may want to set height and overflow
      ref={growlRef} // used to detect growls by their index value
    >
      {growls}
    </div>
  )
}
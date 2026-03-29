/**
 * Growler.jsx
 *
 * A growl has the format:
 *   {
 *     message: <string || {__html: "HTML markup string"},
 *     delay:   <integer milliseconds>,
 *     index:   <incrementing integer>,
 *     time:    <milliseconds from epoch when growl created>
 *   + active:  <undefined | true>,
 *   + closing: <undefined | true>
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


import { useEffect, useContext } from 'react'
import { GrowlContext } from './GrowlContext'
// import { getContextValues } from '../state'
// import '../css/growl.css'


export default function Growler() {
  const {
    growls, // [{ message, delay, index, time + active, closing }]
    start,  // function to add `start` to a growl
    closeGrowl, // function to set { ..., closing: true } in growl
    dismiss
  } = useContext(GrowlContext)
  // } = getContextValues("GrowlContext")


  const treatNewGrowls = () => {
    if (!growls) { return }

    const newGrowls = growls
      .filter( growl => !growl.active)

    if (newGrowls.length) {
      // Calculate the duration of each new growl in milliseconds
      const indexEnds = newGrowls.reduce(( indexEnd, growl ) => {
        const { index, delay, time } = growl
        const end = delay
          ? time + delay - Date.now() // ms duration
          : 0
        indexEnd[index] = end

        return indexEnd
      }, {}) // { <index>: <millisecond duration>, ... }

      // Tell GrowlContext to add { ... active: true } to each
      // of the new growls, and then re-render
      setTimeout(() => start(indexEnds), 100)
    }
  }


  const hideGrowl = (event, index ) => {
    if (event) {
      // Calculate index from which growl's button was clicked
      index = event.target.closest("p").dataset.index
    }

    closeGrowl(index)
  }


  const shrink = ({ target }) => {
    const { className } = target // "active", null, "shrink"

    if (!className) {
      // The "active" class has been removed: slide the growl away
      target.classList.add("shrink")

    } else if (className === "shrink") {
      // The growl is off-screen, and now has a height of 0px.
      // Remove the growl object from activeGrowls, which removes
      // the growl element from the DOM.
      const index = Number(target.dataset.index)

      dismiss(index)
    }
  }


  const showGrowlerMounted = () => {
    console.log("Growler mounted")

    return () => {
      console.log("Growler dismounted")
    }
  }
  useEffect(showGrowlerMounted, [])


  useEffect(treatNewGrowls, [growls])


  const growlArray = growls.map(({
    message,
    delay,
    index,
    active,
    closing
  }) => {
    // Choose between an HTML child or plain text.
    const span = message.__html
      ? <span dangerouslySetInnerHTML={message} />
      : <span>{message}</span>

    const className = (!active || closing )
      ? null // the growl has just been created or is closing
      : "active" // style.transform: translate(-100%)

    return (
      <p
        key={index}
        data-index={index}
        data-delay={delay}
        className={className}
        onTransitionEnd={shrink}
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
    >
      {growlArray}
    </div>
  )
}
/**
 * Growler.jsx
 *
 * A growl has the format:
 *   {
 *     message: <string || {__html: "HTML markup string"},
 *     delay:   <integer milliseconds>,
 *     index:   <incrementing integer>,
 *     on:      <milliseconds since epoch when growl created>
 *   + active:  <initially undefined | immediately set to true>,
 *   + off:     <undefined | milliseconds since epoch when done>
 *   }
 *
 * Animation of growls is managed by CSS.
 */


import { useEffect, useContext, useRef } from 'react'
import { GrowlContext } from './GrowlContext'
// import { getContextValues } from '../state'
import './growl.css'

// Manually set duration of @keyframes animations.
// This assumes that you have set CSS for div#growls.
const GROWL_DURATION = 5000


export default function Growler() {
  const {
    growls, // [{ message, delay, index, on + off }]
    dismissGrowl, // function to set { ..., done: <time> } in growl
    clearGrowls,
    forceRender
  } = useContext(GrowlContext)
  // } = getContextValues("GrowlContext")
  const growlsRef = useRef() // used to set --growl-duration
  

  const appear = growl => {
    const { on } = growl
    const age = Date.now() - on

    return `
      appear
      ease-out
      ${GROWL_DURATION}ms
      ${-age}ms
      forwards`
  }

  const vanish = growl => {
    const { on, off, delay } = growl
    const now  = Date.now()
    const age  = now - on // time since growl started
    const over = off && off - on // undefined | ms since dismissed

    const start = (over)
      ? age < GROWL_DURATION
        ? over - GROWL_DURATION // dismissed while still sliding in
        : 0 // dismissed after sliding all the way in
      : delay - age
    console.log("on, off, delay:", on, off, delay)
    console.log("age:", age, ", over:", over, ", start:", start)

    return `
      vanish
      ease-in
      ${GROWL_DURATION}ms
      ${start}ms
      forwards`
  }


  /**
   * When this componennt is re-rendered, there may be some growls
   * which were in the process of closing. Calculate how far along
   * they are (sliding right, shrinking) and continue the
   * animation from that point. (There may be a flash.)
   */
  const treatOldGrowls = () => {
    // This function is called only once, immediately after this
    // component is mounted. It's a good place to take control of
    // the duration of the animations.
    growlsRef.current?.style.setProperty(
      "--growl-duration",
      GROWL_DURATION+"ms"
    )

    const oldGrowls = growls
      .filter(growl => growl.active)

    oldGrowls.forEach((growl) => {
      // Calculate how far advanced the dismissal process is.
      // Dismissal starts when:
      //   age === growl.delay
      // Sliding right continues until:
      //   age === growl.delay + GROWL_DURATION
      // Shrinking ends when:
      //   age > growl.delay + GROWL_DURATION * 2

      const { delay, off } = growl

      if (delay) {
        growl.animation = `${appear(growl)}, ${vanish(growl)}`

      } else if (off) {
        // A manually dismissed growl has started closing
        growl.animation = `${vanish(growl)}`

      } else {
        // A manually dismissed growl may still be opening
        growl.animation = `${appear(growl)}`
      }

      console.log("OLD growl.animation:", growl.animation)
    })

    forceRender()
  }


  const treatNewGrowls = () => {
    if (!growls) { return }

    const newGrowls = growls
      .filter( growl => !growl.active )

    if (newGrowls.length) {
      newGrowls.forEach(growl => {
        // Update growl in situ, without any setState call
        const { delay } = growl
        if (delay) {
          // Set animation for each new auto-dismissing growl
          growl.animation = `${appear(growl)}, ${vanish(growl)}`

        } else {
          // Manually dismissed growl just opens...
          growl.animation = `${appear(growl)}`
        }

        growl.active = true

        console.log("NEW growl.animation:", growl.animation)

      })

      forceRender()
    }
  }


  const close = (event, index ) => {
    if (event) {
      // Calculate index from which growl's button was clicked
      index = Number(event.target.closest("p").dataset.index)
    }

    dismissGrowl(index)
  }


  const clear = ({ target, animationName }) => {
    if (animationName === "vanish") {
      // The growl is now off-screen, and has a height of 0px.
      // Remove the growl object from growls, which removes
      // the growl element from the DOM.

      const index = Number(target.dataset.index)
      clearGrowls([index])
    }
  }


  // <<< FOR DEBUGGING ONLY
  const showGrowlerMounted = () => {
    console.log("Growler mounted")

    return () => {
      console.log("Growler dismounted")
    }
  }
  useEffect(showGrowlerMounted, [])
  // FOR DEBUGGING ONLY >>>



  useEffect(treatOldGrowls, [])
  useEffect(treatNewGrowls, [growls.length])


  const growlArray = /*(!ready)
    ? ""
    :*/ growls.map(growl => {
      const {
        message,
        delay,
        index,
        off,
        animation
      } = growl

      // Choose between an HTML child or plain text.
      const span = message.__html
        ? <span dangerouslySetInnerHTML={message} />
        : <span>{message}</span>

      const style = (off)
        ? { animation: vanish(growl) }
        : ( animation )
          ? { animation }
          : {} // default opening animation will be applied
      console.log("style:", style)

      return (
        <p
          key={index}
          data-index={index}
          data-delay={delay}
          onAnimationEnd={clear}
          style={style}
        >
          {(!delay || delay > 5555) &&
            < button
              onClick={close}
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
      ref={growlsRef}
    >
      {growlArray}
    </div>
  )
}
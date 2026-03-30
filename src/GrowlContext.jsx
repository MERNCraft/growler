/**
 * GrowlContext.jsx
 *
 * Context to work with the Growler component. Call `newGrowl()`
 * from anywhere where the GrowlContext is available.
 *
 * HTML
 * ----
 * You can use HTML markup and links in the growl message. If you
 * plan to use HTML from unsafe sources, you must ensure that
 * DOMPurify has been installed with `npm i dompurify`.
 * However you cannot run a script from a sanitized growl message.
 *
 * If you want to use your own HTML markup, links or executable
 * code in a growl, wrap the message in an object, like this:
 *
 *  { __html: "Your own HTML markup, which you are sure is safe" }
 *
 * Re-rendering Growler
 * --------------------
 * This Context and its associated Growler component are designed
 * to function smoothly even if the Growler component is
 * re-rendered (for example after an ErrorBoundary key is changed).
 */


import { createContext, use, useState } from 'react'
// Comment out the following line if you do not intend to use
// unsafe userland markup and links in your growls, or DOMPurify
// is not installed
import DOMPurify from 'dompurify'


export const GrowlContext = createContext()


const DELAY = 5000 // Growls close after 5 seconds by default
const MIN_DELAY = 1000 // Ensure delay is at least this value


export const GrowlProvider = ({ children }) => {
  const [ last, setLast ] = useState(0) // tracks index to use
  const [ render, setRender ] = useState(0)
  const [ growlDuration, setGrowlDuration ] = useState(0)
  
  const [ growls, setGrowls ] = useState([])
  // { message: <string | {__html: HTML string}>,
  //   delay:   <integer>,
  //   index:   <integer>
  //   on:    <ms since epoch>,
  // + active:  <boolean>,
  // + off:    <ms since epoch>
  // }


  const forceRender = () => {
    setRender(render + 1)
  }


  const newGrowl = growl => {
    // Accept a plain string, and set delay to DELAY by default
    if (typeof growl === "string") {
      growl = { message: growl }
    }

    // Ensure that the message is a string or { __html: <string> }
    const { message, delay } = growl
    const isDangerous = message.__html // can contain live code
    if (typeof message !== "string" && !isDangerous) { return }

    if (typeof DOMPurify === "function" && !isDangerous) {
      // Allow inclusion of markup and links
      growl.message = {__html: DOMPurify.sanitize(message)}
    }

    // Use default DELAY if no delay is provided
    if (isNaN(delay) || (delay && delay < MIN_DELAY)) {
      growl.delay = DELAY
    }

    // Use a unique incrementing index
    const index = last + 1
    growl.index = index
    growl.on = Date.now() // milliseconds since epoch

    setGrowls(current => [...current, growl])
    setLast(index)

    return index // allows the caller to force close the Growl
  }


  /**
   * Add { ... off: <integer ms> } to the growl that has the given
   * index. If Growler is remounted, this will ensure that the
   * "vanish" animation is given the correct (negative) delay, so
   * that its animation continues smoothly.
   */
  const dismissGrowl = index => {
    if (growls.find(growl => growl.index === index)) {

      setGrowls(current => (
        current.map( growl => {
          if (growl.index === index) {
            growl.off = Date.now()
            growl.delay = 0
          }

          return growl
        })
      ))
    }
  }


  const clearGrowls = indices => {
    if (!Array.isArray(indices)) {
      indices = [indices]
    }

    if (!indices.length) {
      // clear all growls
      return setGrowls(() => [])
    }

    // Keep only growls whose index is not in indices
    setGrowls(current => (
      current.filter(growl => indices.indexOf(growl.index) < 0)
    ))
  }


  return (
    <GrowlContext.Provider
      value ={{
        // For client components
        newGrowl,
        clearGrowls,
        // For Growler component
        growls,
        forceRender,
        // For both clients and Growler
        dismissGrowl
      }}
    >
      {children}
    </GrowlContext.Provider>
  )
}


export default {
  label: "Growl",
  Context: GrowlContext,
  Provider: GrowlProvider
}

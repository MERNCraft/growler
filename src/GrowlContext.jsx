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


import { createContext, useState } from 'react'
// Comment out the following line if you do not intend to use
// unsafe userland markup and links in your growls, or DOMPurify
// is not installed
import DOMPurify from 'dompurify'


export const GrowlContext = createContext()


const DELAY = 5000 // Growls close after 5 seconds by default
const MIN_DELAY = 1000 // Ensure delay is at least this value


export const GrowlProvider = ({ children }) => {
  const [ last, setLast ] = useState(0) // tracks index to use
  const [ growls, setGrowls ] = useState([])
  // { message: <string | {__html: HTML string}>,
  //   delay:   <integer>,
  //   index:   <integer>
  //   time:    <Date>,
  // + active:  <boolean>,
  // + closing: <boolean>
  // }


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
    growl.time = Date.now() // milliseconds since epoch

    setGrowls(current => [...current, growl])
    setLast(index)

    return index // allows the caller to force close the Growl
  }


  /**
   * All index values in indexEnds will be for growls that do not
   * yet have an .active entry yet. Add...
   *   { ... active: true }
   * ... to each such growl, and start a timeout to dismiss any
   * growl that has an `end` duration.
   *
   * @param {object} indexEnds has format { <index>: <ms integer> }
   */
  const start = indexEnds => {
    const indices = Object
      .keys(indexEnds)
      .map(Number) // [index, ...]

    // Create a new growl object for setGrowls, with the effect of
    // creating timeouts for auto-dismissing growls
    setGrowls(current => (
      current.map( growl => {
        // Check if this growl is one that has just been created
        const index = indices.findIndex( index => (
          growl.index === index
        ))
        if (index < 0) {
          // already active, leave unchanged

        } else {
          growl.active = true
          const end = indexEnds[indices[index]]
          setTimeout(closeGrowl, end, growl.index)
        }

        return growl
      })
    ))
  }


  /**
   * Add { ... closing: true } to the growl that has the given
   * index. In Growler, this will ensure that the "active" class is
   * removed from the associated DOM element, so the element will
   * return to its off-screen position on the right.
   */
  const closeGrowl = index => {
    if (!growls.find(growl => (
      growl.index === index)
    )) {
      return
    }

    setGrowls(current => (
      current.map( growl => {
        if (growl.index === index) {
          growl.closing = true
        }

        return growl
      })
    ))
  }


  const dismiss = index => {
    setGrowls(current => (
      current.filter(growl => growl.index !== index)
    ))
  }


  const clearGrowls = () => {
    setGrowls(() => [])
  }


  return (
    <GrowlContext.Provider
      value ={{
        // For client components
        newGrowl,
        clearGrowls,
        // For Growler component
        growls,
        start,
        dismiss,
        // For both clients and Growler
        closeGrowl
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

/**
 * GrowlContext.jsx
 *
 * Context to work with the Growler component. Call `newGrowl()`
 * from anywhere where the GrowlContext is available.
 *
 * You can use HTML markup and links in the growl message, if you
 * ensure that DOMPurify has been installed with `npm i dompurify`.
 * However ou cannot run a script from a growl message.
 */


import { createContext, useState } from 'react'
// Comment out the following line if you do not intend to use
// markup and links in your growls.
import DOMPurify from 'dompurify'


export const GrowlContext = createContext()


const DELAY = 5000 // Growls close after 5 seconds by default
const MIN_DELAY = 1000 // Ensure delay is at least this value


export const GrowlProvider = ({ children }) => {
  const [ last, setLast ] = useState(0) // tracks index to use
  const [ growl, setGrowl ] = useState() // the last new growl
  const [ close, setClose ] = useState() // force closes a growl


  const newGrowl = growl => {
    // Accept a plain string, and set delay to DELAY by default
    if (typeof growl === "string") {
      growl = { message: growl }
    }

    // Ensure that the message is a string
    const { message, delay } = growl
    const isDangerous = message.__html // can contain live code
    if (typeof message !== "string" && !isDangerous) { return}

    if (typeof DOMPurify === "function" && !isDangerous) {
      // Allow inclusion of markup and links
      growl.message = {__html: DOMPurify.sanitize(message)}
    }

    // Use default DELAY if no delay is provided
    if (delay && (isNaN(delay) || delay < MIN_DELAY)) {
      growl.delay = DELAY
    }

    // Use a unique incrementing index
    const index = last + 1

    setGrowl({...growl, index})
    setLast(index)

    return index // allows the caller to force close the Growl
  }


  const closeGrowl = index => {
    setClose(index)
  }


  return (
    <GrowlContext.Provider
      value ={{
        // For client components
        newGrowl,
        closeGrowl,
        // For Growler component
        growl,
        close
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

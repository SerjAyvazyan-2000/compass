'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Template({ children }) {
  useEffect(() => {
    const handlePopState = () => {
      // Push the current state again to disable back navigation
      window.history.pushState(null, document.title, window.location.href)
    }

    // Push the initial state
    window.history.pushState(null, document.title, window.location.href)

    // Listen to the popstate event
    window.addEventListener('popstate', handlePopState)

    return () => {
      // Cleanup event listener
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const overlayLeft = document.createElement('div')
    const overlayRight = document.createElement('div')
    overlayLeft.style.position = 'fixed'
    overlayLeft.style.top = '0'
    overlayLeft.style.left = '0'
    overlayLeft.style.width = '16px'
    overlayLeft.style.height = '100%'
    overlayLeft.style.zIndex = '9999'
    overlayLeft.style.background = 'transparent'

    overlayRight.style.position = 'fixed'
    overlayRight.style.top = '0'
    overlayRight.style.right = '0'
    overlayRight.style.width = '16px'
    overlayRight.style.height = '100%'
    overlayRight.style.zIndex = '9999'
    overlayRight.style.background = 'transparent'

    overlayLeft.addEventListener('touchstart', (event) =>
      event.preventDefault()
    )
    overlayRight.addEventListener('touchmove', (event) =>
      event.preventDefault()
    )
    overlayLeft.addEventListener('touchstart', (event) =>
      event.preventDefault()
    )
    overlayRight.addEventListener('touchmove', (event) =>
      event.preventDefault()
    )

    document.body.appendChild(overlayLeft)
    document.body.appendChild(overlayRight)

    return () => {
      document.body.removeChild(overlayLeft)
      document.body.removeChild(overlayRight)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

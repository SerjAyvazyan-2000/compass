'use client'
import clsx from 'clsx'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export const SplashScreen = ({ isIOS }) => {
  const [isHidden, setIsHidden] = useState(false)
  const [animate, setAnimate] = useState(false)
  const splashScreenRef = useRef(null)

  useEffect(() => {
    const animateTimer = setTimeout(() => {
      setAnimate(true)
    }, 500)

    const hideTimer = setTimeout(() => {
      setIsHidden(true)
    }, 1500)

    return () => {
      clearTimeout(animateTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!isIOS) return null

  return (
    <div
      ref={splashScreenRef}
      className={clsx(
        'absolute h-screen z-30 top-0 w-screen flex bg-white items-center justify-center',
        animate && 'animate-opacity-out',
        isHidden && 'hidden'
      )}
    >
      <Image
        src={'/favicon.png'}
        width={100}
        height={100}
        alt="logo"
        className="object-cover"
      />
    </div>
  )
}

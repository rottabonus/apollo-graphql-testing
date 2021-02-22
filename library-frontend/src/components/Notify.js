import React, { useEffect, useState } from 'react'

export const Notify = ({ errorMessage }) => {

    const [message, setMessage] = useState()

    useEffect(() => {
       setMessage(errorMessage)
       const messageTimer = setTimeout(() => {
           setMessage(null)
       }, 4000)
       return () => clearTimeout(messageTimer) 
    },[errorMessage])

    return (
      <div style={{color: 'red'}}>
        {message ? message : null}
      </div>
    )
  }
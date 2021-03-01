import React from 'react'

export const Recommend = ({ show }) => {

    const favouriteGenre = 'comic'

    if (!show) {
        return null
      }
    

    return (
      <div>
          <p>Hello this is recommended view <b>{favouriteGenre}</b>
          </p>
      </div>
    )
  }

export default Recommend
import React, { useEffect, useState } from 'react'
import { ME } from '../queries'
import { useQuery } from '@apollo/client'

export const Recommend = ({ show }) => {

    const meResult = useQuery(ME)
    const [favoriteGenre, setFavoriteGenre] = useState('')

    if (!show) {
        return null
      }

    
    useEffect(() => {
        if(!meResult.loading){
            setFavoriteGenre(meResult.data.me.favoriteGenre)
        }
    },[meResult])
    

    return (
      <div>
          <p>Hello this is recommended view  <b>{favoriteGenre}</b>
          </p>
      </div>
    )
  }

export default Recommend
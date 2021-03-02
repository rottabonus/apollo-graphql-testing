import React, { useEffect, useState } from 'react'
import { ME, ALL_BOOKS } from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'

export const Recommend = ({ show }) => {

    const meResult = useQuery(ME)
    const [favoriteGenre, setFavoriteGenre] = useState('')
    const [booksGenreQuery, { called, loading, data }] = useLazyQuery(ALL_BOOKS)
    const [books, setBooks] = useState([])


    if (!show) {
        return null
      }

    
    useEffect(() => {
        if(!meResult.loading){
            setFavoriteGenre(meResult.data.me.favoriteGenre)
            console.log(meResult.data.me.favoriteGenre)
            booksGenreQuery({
              variables: {
                genre: meResult.data.me.favoriteGenre
              }
            })
        }
    },[meResult])


    useEffect(() => {
      if(!loading && called){
        setBooks(data.allBooks)
      }
    })
    

    return (
      <div>
          <p>Recommended books in your favorite genre  <b>{favoriteGenre}</b>
          </p>
          <table>
            <tbody>
              {books.map(book => 
                <tr key={book.title}> 
                  <td>
                    {book.title}
                  </td>
                </tr>)}
            </tbody>
          </table>
      </div>
    )
  }

export default Recommend
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const [filterGenre, setFilterGenre] = useState('all genres')
  const [allGenres, setAllGenres] = useState([])
  const [books, setBooks] = useState([])
  const booksResult = useQuery(ALL_BOOKS)
  const [booksGenreQuery, { called, loading, data }] = useLazyQuery(ALL_BOOKS)
  

  if (!props.show) {
    return null
  }

  const getBooksByGenre = (genre) => {
    if(genre === 'all genres'){
      booksGenreQuery()
    } else {
      booksGenreQuery({
        variables: {
          genre: genre
        }
      })
    }
    setFilterGenre(genre)
  }

  const pillStyle = {
    margin: '4px 2px', 
    borderRadius: '16px', 
    padding: '2px 4px', 
    cursor: 'pointer',
    textAlign: 'center'
  }

  useEffect(() => {
    if(!booksResult.loading){
      setBooks(booksResult.data.allBooks)
      setAllGenres([...new Set(['all genres'].concat(booksResult.data.allBooks.map(b => b.genres).flat()))])
    }
  },[booksResult])

  useEffect(() => {
    if(!loading && called){
      setBooks(data.allBooks)
    }
  },[data])

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>
              title
            </th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{display: 'flex', flexWrap: 'wrap', width: '40%'}}>
            {
            allGenres.map(genre => 
            <div
              style={{...pillStyle, backgroundColor: genre === filterGenre ? 'lightsalmon' : 'wheat'}}
              onClick={() => getBooksByGenre(genre)}
              key={genre}>
              {genre.toLowerCase()}
            </div>)
            }
      </div>
    </div>
  )
}

export default Books
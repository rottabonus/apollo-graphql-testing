import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const booksResult = useQuery(ALL_BOOKS)
  const [filterGenre, setFilterGenre] = useState('all genres')
  const [books, setBooks] = useState([])

  if (!props.show) {
    return null
  }

  const allGenres = [...new Set(['all genres'].concat(books.map(b => b.genres).flat()))]
  const booksToShow  = filterGenre === 'all genres' ? books : books.filter(b => b.genres.includes(filterGenre))

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
    }
  },[booksResult])

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
          {booksToShow.map(a =>
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
              onClick={() => setFilterGenre(genre)}
              key={genre}>
              {genre.toLowerCase()}
            </div>)
            }
      </div>
    </div>
  )
}

export default Books
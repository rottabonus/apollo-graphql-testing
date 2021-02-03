  
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, SET_BORN } from '../queries'


const Authors = (props) => {

  const authorResult = useQuery(ALL_AUTHORS)
  const authors = authorResult.loading ? [] : authorResult.data.allAuthors
  const [year, setYear] = useState(null)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [ setBorn ] = useMutation(SET_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS} ]
  })

  const onYearChange = (event) => {
    setYear(Number(event.target.value))
  }

  const onAuthorChange = (event) => {
    setSelectedAuthor(event.target.value)
  }

  const changeBornEvent = async (event) => {
    event.preventDefault()
    console.log('setting born...')
    setBorn({
      variables: {
        name: selectedAuthor, 
        setBorn: year, 
      }
     })
    setYear(null)
  }


  if (!props.show) {
    return null
  }
  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
        <div>
          <h2>Set birthyear</h2>
          <span>Author</span>
          <select onChange={(e) => onAuthorChange(e)}>
            {authors.map(a => {
              return(
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
              )}
            )}
          </select>
          <div>
            Year
            <input
             value={year}
             type='number'
             min='1'
             max={new Date().getFullYear()} 
             onChange={(e) => onYearChange(e)}/>
          </div>
          <div>
            <button onClick={(e) => changeBornEvent(e)}>
              Set
            </button>
          </div>
        </div>
    </div>
  )
}

export default Authors

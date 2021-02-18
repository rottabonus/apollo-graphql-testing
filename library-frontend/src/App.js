
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('token'))


  const logOut = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  console.log('token', token)
  const LoggedIn = () => {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={logOut}>logout</button>
        </div>
        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        <NewBook show={page === 'add'}/>
     </div>
    )
  }

  return (
    <div>
      { token ?
      <LoggedIn />
      :
      <Login 
       show={page === 'login'} 
       setToken={setToken}/>
      }
    </div>
  )
}

export default App
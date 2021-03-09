
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import { useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('token'))


  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ onSubscriptionData }) => {
      console.log(onSubscriptionData)
    }
  })


  const logOut = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  console.log('token', token)
  const LoggedIn = () => {
    return (
      <div>
        <div>
          <button onClick={() => setPage('recommended')}>recommended</button>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={logOut}>logout</button>
        </div>
        <Recommend show={page === 'recommended'} />
        <Authors show={page === 'authors'} loggedIn={true} />
        <Books show={page === 'books'} />
        <NewBook show={page === 'add'} />
      </div>
    )
  }

  const NotLoggedIn = () => {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        <Login
          show={page === 'login'}
          setPage={setPage}
          setToken={setToken} />
        <Authors
          show={page === 'authors'}
          loggedIn={false} />
        <Books show={page === 'books'} />
      </div>
    )
  }

  return (
    <div>
      { token ?
        <LoggedIn />
        :
        <NotLoggedIn />
      }
    </div>
  )
}

export default App
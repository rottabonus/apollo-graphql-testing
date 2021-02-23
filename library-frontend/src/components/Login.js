import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'
import { Notify } from './Notify'


const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)


  if(!props.show){
    return null
  }


  const [ login, result ] = useMutation(LOGIN, {
      onError: (error) => setError(error.graphQLErrors[0].message)
  })

  const submit = async (event) => {
    event.preventDefault()
    console.log('login...')
    login({
      variables: {
        username, 
        password
      }
     })
    setUsername('')
    setPassword('')
  }

  useEffect(() => {
    if(result.data){
        console.log(result.data)
        const token = result.data.login.value
        props.setToken(token)
        localStorage.setItem('token', token)
        props.setPage('books')
    }
  },[result]) //eslint-disable-line

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
        <Notify errorMessage={error}/>
      </form>
    </div>
  )
}

export default Login
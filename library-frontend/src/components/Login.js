import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'


const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [ login, result ] = useMutation(LOGIN, {
      onError: (error) => console.log(error)
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
    }
  },[result]) 

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
      </form>
    </div>
  )
}

export default Login
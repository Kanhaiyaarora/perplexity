import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';

const Dashboard = () => {

  const { user } = useSelector(state => state.auth)
  console.log(user);
  const { initializedSocketConnection } = useChat();
  useEffect(() => {
    initializedSocketConnection()
  }, [])

  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard

'use client'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import UserDetailsContext from '@/Context/UserDetailContext'
import { OnsaveContext } from '../Context/OnSaveContext'

const Provider = ({ children }) => {
  const { user } = useUser()
  const [userDetails, setUserDetails] = useState()
  const [onSaveData, setOnSaveData] = useState(null)

  useEffect(() => {
    if (user) createNewUser()
  }, [user])

  const createNewUser = async () => {
    try {
      const res = await axios.post('/api/users', {})
      console.log(res.data)
      setUserDetails(res.data.user)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return <>
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }} >
      <OnsaveContext.Provider value={{ onSaveData, setOnSaveData }} >
      {children}
      </OnsaveContext.Provider>
    </UserDetailsContext.Provider>
  </>
}

export default Provider

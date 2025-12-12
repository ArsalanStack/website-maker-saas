import React from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"


function AppHeader() {
  return (
    <div className='flex justify-between items-center p-4 shadow'>
        <SidebarTrigger />
    </div>
  )
}

export default AppHeader
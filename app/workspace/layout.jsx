import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'


const Layout = ({children}) => {
  return (
     <SidebarProvider>
      {/* Flex container for sidebar + main */}
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col bg-background">
          {/* Header */}
          <AppHeader />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
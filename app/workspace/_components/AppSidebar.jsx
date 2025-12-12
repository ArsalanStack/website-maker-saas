'use client'
import { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import Image from "next/image"
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Progress } from '@/components/ui/progress'
import { useContext } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import UserDetailsContext from '@/Context/UserDetailContext'



export function AppSidebar() {

  const [projectList, setProjectList] = useState()
  const [loading, setLoading] = useState(false)

  const { userDetails, setUserDetails } = useContext(UserDetailsContext)


  useEffect(() => {
    GetProjectsList()
  }, [])



  const GetProjectsList = async () => {
    setLoading(true)
    const result = await axios.get('/api/get-all-projects');

    setProjectList(result.data)

    setLoading(false)
  }


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <Image src={'/logo.svg'} width={35} height={35} alt="logo" />
          <h2 className="font-bold text-xl">Ai website maker</h2>
        </div>
        <Link className='mt-5 w-full' href="/workspace">
          <Button className="w-full">+ New Project</Button>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroup>
          {!loading &&  projectList?.length == 0 &&
            <h2 className='text-sm px-2 text-gray-500'>No projects</h2>
          }

        <div>
  {(!loading && projectList?.length > 0) ? (
    projectList.map((project, index) => (
      <Link
        href={`/playground/${project.projectId}?frameId=${project.frameId}`}
        key={index}
        className="
          block
          w-full
          py-2 px-3
          rounded-lg
          transition-all
          duration-200
          hover:bg-gray-100
          cursor-pointer
        "
      >
        <h2 className="line-clamp-1">
          {project?.chats[0].chatMessage[0]?.content}
        </h2>
      </Link>
    ))
  ) : (
    [1, 2, 3, 4, 5].map((_, index) => (
      <Skeleton key={index} className="w-full h-10 rounded-lg mt-2" />
    ))
  )}
</div>

        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="p-3 border rounded-xl space-x-3 bg-secondary">
          <h2 className='flex justify-between items-center mb-2'>Remaining credits <span className='font-bold'>2</span></h2>
          <Progress value={33} />
          <Button className="w-full mt-2">
            Get Credits
          </Button>
        </div>
        <div className="ml-4 flex gap-2 items-center">
          <UserButton />
          <Button variant={'ghost'}>Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
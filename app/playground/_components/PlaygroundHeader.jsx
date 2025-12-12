import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useContext } from 'react';
import { OnsaveContext } from '@/Context/OnSaveContext';


function PlaygroundHeader() {


  const { onSaveData, setOnSaveData } = useContext(OnsaveContext);

  return (
    <div className='flex justify-between items-center p-4 shadow'>
      <Link href="/" className="flex items-center">
        <Image src={"/logo.svg"} alt="logo" width={70} height={50} />
        <span className='text-xl sm:text-base font-semibold text-gray-900'>Website Designer</span>
      </Link>
      <Button onClick={() => setOnSaveData(Date.now())}>Save</Button>
    </div>
  )
}

export default PlaygroundHeader
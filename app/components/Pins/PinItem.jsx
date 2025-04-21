import Image from 'next/image'
import React from 'react'
import UserTag from '../UserTag'
import { useRouter } from 'next/navigation'

function PinItem({ pin }) {
  const router = useRouter()
  const user = {
    name: pin?.userName,
    image: pin?.userImage,
  }

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300">
      <div
        className="relative group cursor-pointer"
        onClick={() => router.push('/pin/' + pin.id)}
      >
        <Image
          src={pin.image}
          alt={pin.title}
          width={500}
          height={500}
          className="rounded-3xl transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 rounded-3xl bg-black bg-opacity-0 group-hover:bg-opacity-40 z-10 transition duration-300" />
      </div>

      <div className="px-4 pt-3 pb-4">
        <h2 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {pin.title}
        </h2>
        <UserTag user={user} />
      </div>
    </div>
  )
}

export default PinItem

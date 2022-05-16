import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  playlistAtom,
  playlistIdState,
  playlistState,
} from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-greem-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export default function Center() {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [color, setColor] = useState()
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => setPlaylist(data.body))
      .catch((error) => console.log('Error retrieving playlist: ', playlistId))
  }, [spotifyApi, playlistId])

  console.log(playlist)

  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80">
          <img
            className="h-10 w-10 rounded-full bg-gray-800"
            src={session?.user?.image || '/no-user-image.svg'}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <h1>Hello</h1>
        {/* <img src="" alt="" /> */}
      </section>
    </div>
  )
}

import React, { useEffect, useRef, useState } from "react"
import { ImSpinner2 } from "react-icons/im"
import { BsFillBarChartFill } from "react-icons/bs"
import { FiAlertCircle } from "react-icons/fi"
import { PostType } from "../generated/graphql"
import { Link } from "react-router-dom"

function PostUser({ post }: { post: PostType }) {
  const video = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleLoadedData = () => {
      console.log("loaded")
      setTimeout(() => {
        setIsLoaded(true)
      }, 300)
    }

    const videoRef = video.current
    videoRef?.addEventListener("loadeddata", handleLoadedData)

    return () => {
      if (!videoRef) return
      videoRef?.removeEventListener("loadeddata", handleLoadedData)
      videoRef?.pause()
      videoRef.currentTime = 0
    }
  }, [])
  const isHover = (bool: boolean) => {
    if (bool) {
      video.current?.play()
    } else {
      video.current?.pause()
    }
  }

  return (
    <Link to={`/post/${post.id}`}>
      <div
        className="relative brightness-90 hover:brightness-[1.1] cursor-pointer"
        onMouseEnter={() => isHover(true)}
        onMouseLeave={() => isHover(false)}
      >
        {!isLoaded && (
          <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
            <ImSpinner2
              className="animate-spin ml-1"
              size="100"
              color="#FFFFFF"
            />
          </div>
        )}
        <div>
          <video
            ref={video}
            muted
            loop
            className="aspect-[3/4] object-cover rounded-md"
            src={"http://localhost:3001/" + post.video}
          />
        </div>
        <div className="px-1">
          <div className="text-gray-700 text-[15px] pt-1 break-words">
            {post.text}
          </div>
          <div className="flex items-center -ml-1 text-gray-600 font-bold text-xs">
            <BsFillBarChartFill className="ml-1" size="16" />

            <div className="mx-1">3%</div>
            <FiAlertCircle size="20" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostUser

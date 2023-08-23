import React, { useEffect, useState } from "react"
import { ImCross } from "react-icons/im"
import { Link, useNavigate } from "react-router-dom"
import { BiChevronUp, BiChevronDown } from "react-icons/bi"
import { ImSpinner2 } from "react-icons/im"
import { MdOutlineDeleteForever } from "react-icons/md"
import { BsMusicNoteBeamed, BsFillChatDotsFill } from "react-icons/bs"
import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai"
import { GET_POST_BY_ID } from "../graphql/queries/getPostById"
import { useParams } from "react-router-dom"

import { CREATE_COMMENT } from "../graphql/mutations/createComment"
import { GET_COMMENTS_BY_POST_ID } from "../graphql/queries/getCommentsByPostId"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_COMMENT } from "../graphql/mutations/deleteComment"
import { GetCommentsByPostIdQuery } from "../gql/graphql"
import { usePostStore } from "../stores/postStore"
import { useUserStore } from "../stores/userStore"

import { LIKE_POST } from "../graphql/mutations/likePost"
import { UNLIKE_POST } from "../graphql/mutations/unlikePost"
function SinglePost() {
  const { id } = useParams<{ id: string }>()
  const [comment, setComment] = React.useState<string>("")
  const navigate = useNavigate()
  const [createComment, { data: commentData }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      {
        query: GET_COMMENTS_BY_POST_ID,
        variables: {
          postId: Number(id),
          text: comment,
        },
      },
    ],
  })

  const { data, loading: loadingComments } = useQuery<GetCommentsByPostIdQuery>(
    GET_COMMENTS_BY_POST_ID,
    {
      variables: {
        postId: Number(id),
      },
    }
  )

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update(cache, { data: { deleteComment } }) {
      console.log("DELETED COMMENT", data)
      const deletedCommentId = deleteComment.id
      const existingComments = cache.readQuery<GetCommentsByPostIdQuery>({
        query: GET_COMMENTS_BY_POST_ID,
        variables: { postId: Number(id) },
      })

      // Filter out the deleted comment
      const newComments = existingComments?.getCommentsByPostId.filter(
        (comment) => comment.id !== deletedCommentId
      )

      console.log("NEW COMMENTS", newComments)
      cache.writeQuery({
        query: GET_COMMENTS_BY_POST_ID,
        data: { getCommentsByPostId: newComments },
        variables: { postId: Number(id) },
      })
    },
  })

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment({
      variables: {
        id: commentId,
      },
    })
  }
  const [currentPostIdIndex, setCurrentPostIdIndex] = useState<number>(0)
  const loopThroughPostsUp = () => {
    if (currentPostIdIndex === dataPost.getPostById.otherPostIds.length - 1)
      return
    setCurrentPostIdIndex(currentPostIdIndex + 1)
    console.log(currentPostIdIndex)

    const nextPostId = dataPost.getPostById.otherPostIds[currentPostIdIndex]
    console.log(nextPostId)
    navigate(`/post/${nextPostId}`)
  }

  const loopThroughPostsDown = () => {
    if (currentPostIdIndex === 0) return
    setCurrentPostIdIndex(currentPostIdIndex - 1)

    const nextPostId = dataPost.getPostById.otherPostIds[currentPostIdIndex]
    console.log(nextPostId)
    navigate(`/post/${nextPostId}`)
  }

  const { data: dataPost, loading: loadingPost } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: Number(id),
    },
    onCompleted: () => {
      setIsLoaded(true)
    },
  })
  console.log("POST DATA", dataPost, loadingPost)
  const video = React.useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const addComment = () => {
    createComment({
      variables: {
        postId: Number(id),
        text: comment,
      },
    })
    setComment("")
  }
  const [inputFocussed, setInputFocussed] = React.useState(false)

  useEffect(() => {
    const handleLoadedData = () => {
      console.log("loaded")
      video.current?.play()
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
      videoRef.load()
    }
  }, [isLoaded, setIsLoaded])
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleVideoPlay = () => {
    if (video.current) {
      if (isPlaying) {
        video.current.pause()
      } else {
        video.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const likedPosts = usePostStore((state) => state.likedPosts)
  const likePost = usePostStore((state) => state.likePost)
  const removeLike = usePostStore((state) => state.removeLike)
  const loggedInUserId = useUserStore((state) => state.id)
  // check whether the id of logged in user is in the array of liked posts, where each liked post is an object with an id property, userId and postId

  const [likePostMutation] = useMutation(LIKE_POST, {
    variables: {
      postId: Number(id),
    },

    onCompleted: (data) => {
      console.log("DATA", data)
    },
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: Number(id),
        },
      },
    ],
  })

  const [removeLikeMutation] = useMutation(UNLIKE_POST, {
    variables: {
      postId: Number(id),
    },
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: Number(id),
        },
      },
    ],
  })

  const handleRemoveLike = async () => {
    console.log(loggedInUserId, dataPost.getPostById.user.id)
    if (loggedInUserId == dataPost.getPostById.user.id) return
    await removeLikeMutation()
    removeLike(Number(id))
  }

  const handleLikePost = async () => {
    console.log(loggedInUserId, dataPost.getPostById.user.id)
    if (loggedInUserId == dataPost.getPostById.user.id) return
    await likePostMutation()
    likePost({
      id: Number(id),
      userId: Number(loggedInUserId),
      postId: Number(id),
    })
  }

  const isLiked = likedPosts.some((likedPost) => {
    if (!likedPost) return false
    return likedPost.userId === Number(loggedInUserId)
  })

  return (
    <div
      className="fixed lg:flex justify-betweem z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto "
      id="PostPage"
    >
      <div className="lg:w-[calc(100%-540px)] h-full relative">
        <Link
          to="/"
          className="absolute z-20 m-5 rounded-full hover:bg-gray-800 bg-gray-700 p-1.5"
        >
          {" "}
          <ImCross color="#FFFFFF" size="27" />
        </Link>
        <button
          onClick={loopThroughPostsUp}
          className="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <BiChevronUp color="#FFFFFF" size="30" />
        </button>
        <button
          onClick={loopThroughPostsDown}
          className="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <BiChevronDown color="#FFFFFF" size="30" />
        </button>
        {true && (
          <div>
            <button
              disabled={!isLoaded}
              onClick={loopThroughPostsUp}
              className="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
            >
              <BiChevronUp color="#FFFFFF" size="30" />
            </button>
            <button
              disabled={!isLoaded}
              onClick={loopThroughPostsDown}
              className="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
            >
              <BiChevronDown color="#FFFFFF" size="30" />
            </button>
          </div>
        )}

        <img
          className="absolute top-[18px] left-[70px] max-w-[80px] rounded-full lg:mx-0 mx-auto"
          src="/src/assets/images/tiktok-logo-small.png"
        />

        {loadingPost ? (
          <div className="flex items-center justify-center bg-black bg-opacity-70 h-screen lg:min-w-[400px]">
            <ImSpinner2
              className="animate-spin ml-1"
              size="100"
              color="#FFFFFF"
            />
          </div>
        ) : (
          <div
            className="bg-black bg-opacity-90 lg:min-w-[480px] "
            onClick={toggleVideoPlay}
          >
            <video
              ref={video}
              src={"http://localhost:3001/" + dataPost.getPostById.video}
              loop
              muted
              className="h-screen mx-auto"
            />
            {!isPlaying && (
              <AiFillPlayCircle
                size="100"
                className="rounded-full z-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blackcursor-pointer"
              />
            )}
          </div>
        )}
      </div>
      <div
        className="lg:max-w-[550px] relative w-full h-full bg-white"
        id="InfoSection"
      >
        <div className="py-7" />
        <div className="flex items-center justify-between px-8">
          <div className="flex items-center">
            <Link to="/">
              <img
                className="rounded-full lg:mx-0 mx-auto"
                width="40"
                src="https://picsum.photos/id/8/300/320"
              />
            </Link>
            <div className="ml-3 pt-0.5">
              <div className="text-[17px] font-semibold">User name</div>
              <div className="text-[13px] -mt-5 font-light">
                {dataPost?.getPostById?.user.fullname}
                <span className="relative top-[6px] text-[30px] pr-0.5">•</span>
                <span className="font-medium">
                  {/* display time in human readable format  */}
                  {new Date(dataPost?.getPostById?.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <MdOutlineDeleteForever size="25" className="cursor-pointer" />
        </div>
        <div className="px-8 mt-4 text-sm"> {dataPost?.getPostById?.text}</div>

        <div className="px-8 mt-4 text-sm font-bold">
          <BsMusicNoteBeamed size="17" />
          Original sound - username
        </div>
        <div className="flex items-center px-8 mt-8">
          <div className="pb-4 text-center flex items-center">
            <button
              disabled={dataPost?.getPostById?.userId === loggedInUserId}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
              onClick={() => (isLiked ? handleRemoveLike() : handleLikePost())}
            >
              <AiFillHeart size="25" color={isLiked ? "red" : "black"} />
            </button>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              {dataPost?.getPostById?.likes.length}
            </span>
          </div>
          <div className="pb-4 text-center flex items-center">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <BsFillChatDotsFill size="25" color="black" />
            </div>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              {data?.getCommentsByPostId?.length}
            </span>
          </div>
        </div>
        <div
          id="Comments"
          className="bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
        >
          <div className="pt-2" />
          {data?.getCommentsByPostId.length === 0 && (
            <div className="text-center mt-6 text-xl text-gray-500">
              No comments...
            </div>
          )}
          <div className="flex flex-col items-center justify-between px-8 mt-4">
            {data?.getCommentsByPostId.map((comment) => (
              <div
                className="flex items-center relative w-full"
                key={comment.id}
              >
                <Link to="/">
                  <img
                    className="absolute top-0 rounded-full lg:mx-0 mx-auto"
                    width="40"
                    src="https://picsum.photos/id/8/300/320"
                  />
                </Link>
                <div className="ml-14 pt-0.5 w-full">
                  <div className="text-[18px] font-semibold flex items-center justify-between">
                    User name
                    {comment.user.id === Number(loggedInUserId) && (
                      <MdOutlineDeleteForever
                        onClick={() => handleDeleteComment(comment.id)}
                        size="25"
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="text-[15px] font-light">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-28" />
        </div>
        <div
          id="CreateComment"
          className="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2 "
        >
          <div
            className={[
              inputFocussed
                ? "border-2 border-gray-400"
                : "border-2 border-[#F1F1F2]",
              "flex items-center rounded-lg w-full lg:max-w-[420px] bg-[#F1F1F2] ",
            ].join(" ")}
          >
            <input
              onChange={(e) => setComment(e.target.value)}
              onFocus={() => setInputFocussed(true)}
              onBlur={() => setInputFocussed(false)}
              className="bg-[#F1F1F2] tex-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
              type="text"
              placeholder="Add a comment..."
            />
          </div>
          <button
            disabled={!comment}
            onClick={addComment}
            className={[
              comment ? "text-[#F02C56] cursor-pointer" : "text-gray-400",
              "font-semibold text-sm ml-5 pr-1",
            ].join(" ")}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default SinglePost

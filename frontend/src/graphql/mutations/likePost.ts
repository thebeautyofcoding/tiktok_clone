import { gql } from "@apollo/client"
export const LIKE_POST = gql`
  mutation LikePost($postId: Float!) {
    likePost(postId: $postId) {
      id
      userId
      postId
    }
  }
`

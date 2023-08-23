import { gql } from "@apollo/client"
export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: Float!) {
    unlikePost(postId: $postId) {
      id
      userId
      postId
    }
  }
`

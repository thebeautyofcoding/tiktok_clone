import { gql } from "@apollo/client"

export const CREATE_COMMENT = gql`
  mutation CreateComment($text: String!, $postId: Float!) {
    createComment(text: $text, postId: $postId) {
      text
      id
      createdAt
      user {
        id
        fullname
        email
      }
      post {
        id
        text
        video
      }
    }
  }
`

import { gql } from "@apollo/client"
export const CREATE_POST = gql`
  mutation CreatePost($text: String!, $video: Upload!) {
    createPost(text: $text, video: $video) {
      id
      text
      video
    }
  }
`

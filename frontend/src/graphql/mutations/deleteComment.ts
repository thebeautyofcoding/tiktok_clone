import { gql } from "@apollo/client"

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: Float!) {
    deleteComment(id: $id) {
      id
      __typename
    }
  }
`

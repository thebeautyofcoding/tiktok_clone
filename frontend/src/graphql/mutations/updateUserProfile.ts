import { gql } from "@apollo/client"

export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfile(
    $fullname: String!
    $bio: String!
    $image: Upload
  ) {
    updateUserProfile(fullname: $fullname, bio: $bio, image: $image) {
      id
      fullname
      bio
      image
    }
  }
`

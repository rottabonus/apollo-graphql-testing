import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
query {
    allBooks {
        title
        published
        author {
          name
          born
          bookCount
        }
        genres
    }
}
`

export const ADD_BOOK = gql`
mutation addBook(
  $title: String!,
  $published: Int!,
  $author: String!,
  $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author
      genres
      id
   }
}
`

export const SET_BORN = gql`
mutation editAuthor(
  $name: String!,
  $setBorn: Int!
) {
  editAuthor (
    name: $name,
    setBorn: $setBorn
  ) {
    name
    born
    id
    bookCount
  }
}`
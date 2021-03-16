import { gql } from '@apollo/client'


export const BOOK_FRAGMENT = gql`
fragment BookDetails on Book {
  title
  published
  genres
  author {
    name
    born
    bookCount
  }
}`

export const ALL_BOOKS = gql`
query allBooks($genre: String) { 
    allBooks(genre: $genre) {
      ...BookDetails
  }
}
${BOOK_FRAGMENT}
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
      ...BookDetails
   }
}
${BOOK_FRAGMENT}
`


export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
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


export const LOGIN = gql`
mutation login(
  $username: String!
  $password: String!
){
  login(
    username: $username,
    password: $password
  ){
    value
  }
}`


export const ME = gql`
query { 
  me {
  username
  favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_FRAGMENT}
`

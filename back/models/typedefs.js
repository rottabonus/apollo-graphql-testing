const { gql } = require('apollo-server')

const typeDefs = gql`
type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
}

type User {
  username: String!
  passwordHash: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

type Author {
  name: String!
  born: Int
  id: ID!
  bookCount: Int!
}

type Subscription {
  bookAdded: Book!
}

type Mutation {
addBook(
  title: String!,
  published: Int!
  author: String!
  genres: [String!]!
): Book

editAuthor(
  name: String!,
  setBorn: Int!
): Author

createUser(
  username: String!
  password: String!
  favoriteGenre: String!
): User

login(
  username: String!
  password: String!
): Token
}`

module.exports = { typeDefs }
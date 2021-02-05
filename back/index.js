const config =  require('./local_config.json')
const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = `mongodb+srv://${config.db_user}:${config.db_password}@zordbase.mvald.mongodb.net/${config.db_name}?retryWrites=true&w=majority`

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = gql`
  type Query {
      authorCount: Int!
      bookCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
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
}`


const resolvers = {
  Query: {
      authorCount: () => Author.collection.countDocuments(),
      bookCount: () => Book.collection.countDocuments(),
      allBooks: (root, args) => {
        if(!args){
          return authors
        }
        /*
        const byGenre = (book) => args.genre ? book.genres.includes(args.genre) : []
        const byAuthor = (book) => args.author ? book.author === args.author : []
        return books.filter(b => byGenre(b) && byAuthor(b))*/
        return Book.find({})
      },
      allAuthors: (root, args) => Author.find({})
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if(!author){
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }

      const book = new Book({ ...args, author })
      
      try {
        await book.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return book
    },
    editAuthor: async (root, args) => {
      const oldAuthor = await Author.findOne({name: args.name})
      if(!oldAuthor){
        return null
      }
      const updatedAuthor = {...oldAuthor, born: args.setBorn}
      return updatedAuthor.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
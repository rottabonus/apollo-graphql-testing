const config =  require('./local_config.json')
const { ApolloServer, gql, ApolloError, UserInputError } = require('apollo-server')
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

function isValidAuthorName(author){
  return typeof author === 'string' && author.length >= 4
}

function isValidBookTitle(title){
  return typeof title === 'string' && title.length >= 2
}


const resolvers = {
  Query: {
      authorCount: () => Author.collection.countDocuments(),
      bookCount: () => Book.collection.countDocuments(),
      allBooks: async (root, args) => {
        if(!args){
          return await Book.find({})
        }
        /*
        const byGenre = (book) => args.genre ? book.genres.includes(args.genre) : []
        const byAuthor = (book) => args.author ? book.author === args.author : []
        return books.filter(b => byGenre(b) && byAuthor(b))*/

        return await Book.find({ genres: { $in: [args.genre] } })
      },
      allAuthors: async (root, args) => {
        const allAuthors = await Author.find({})
        const allBooks = await Book.find({})
        const mapped = allAuthors.map(a => {
          const bookCount = allBooks.filter(b => b.author.toString() === a.id.toString()).length
          return {
            name: a.name,
            born: a.born,
            bookCount
          }
        })
        return mapped
     }
  },
  Mutation: {
    addBook: async (root, args) => {
      const validationErrors = {}
      let author = await Author.findOne({ name: args.author })

      if(!author){
        author = new Author({ name: args.author })
        if (!isValidAuthorName(args.author)) {
          validationErrors.author = 'This is not a valid author name'
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
          'Failed to add author due to validation errors',
          { validationErrors }
        )
      }
        try {
          await author.save()
        } catch (error) {
          throw new ApolloError(error.message, {
            invalidArgs: args
          })
        }
      }

      const book = new Book({ ...args, author })
      if (!isValidBookTitle(args.title)) {
        validationErrors.title = 'This is not a valid book title'
      }
      if (Object.keys(validationErrors).length > 0) {
        throw new UserInputError(
        'Failed to add a book due to validation errors',
        { validationErrors }
      )
    }
      try {
        await book.save()
      } catch(error) {
        throw new ApolloError(error.message, {
          invalidArgs: args
        })
      }
      return book
    },

    editAuthor: async (root, args) => {
      let author = await Author.findOne({ name: args.name })
      if(!author){
        return null
      }
      author.born = args.setBorn
      return author.save()
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
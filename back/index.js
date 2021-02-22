const config =  require('./local_config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { ApolloServer, ApolloError, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { typeDefs } =  require('./models/typedefs')
const validation = require('./validation')

const MONGODB_URI = `mongodb+srv://${config.db_user}:${config.db_password}@zordbase.mvald.mongodb.net/${config.db_name}?retryWrites=true&w=majority`

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



const resolvers = {
  Query: {
      authorCount: () => Author.collection.countDocuments(),
      bookCount: () => Book.collection.countDocuments(),
      allBooks: async (root, args) => {

        const allAuthors = await resolvers.Query.allAuthors()
        
        if(Object.keys(args).length === 0){
          const books = await Book.find({})
          const mapped = books.map(b => {
            return {
              ...b._doc, 
              author: allAuthors.find(a => a._id.toString() === b.author.toString())}
          })
          return mapped
        }
        /*
        const byGenre = (book) => args.genre ? book.genres.includes(args.genre) : []
        const byAuthor = (book) => args.author ? book.author === args.author : []
        return books.filter(b => byGenre(b) && byAuthor(b))*/
        const books = await Book.find({ genres: { $in: [args.genre] } })
        const mapped = books.map(b => {
          return {
            ...b._doc, 
            author: allAuthors.find(a => a._id.toString() === b.author.toString())}
        })
        return mapped
      },
      allAuthors: async (root, args) => {
        const allAuthors = await Author.find({})
        const allBooks = await Book.find({})
        const mapped = allAuthors.map(a => {
        const bookCount = allBooks.filter(b => b.author.toString() === a.id.toString()).length
          return {
            ...a._doc,
            bookCount
          }
        })
        return mapped
     },

     me: (root, args, context) => {
       return context.currentUser
     }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const user = context.currentUser
      if(!user){
        throw new AuthenticationError('Not authenticated')
      }
      const validationErrors = {}
      let author = await Author.findOne({ name: args.author })

      if(!author){
        author = new Author({ name: args.author })
        if (!validation.isValidAuthorName(args.author)) {
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
      if (!validation.isValidBookTitle(args.title)) {
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

    editAuthor: async (root, args, context) => {

      const user = context.currentUser 
      if(!user){
        throw new AuthenticationError('Not authenticated')
      }

      let author = await Author.findOne({ name: args.name })
      if(!author){
        return null
      }
      author.born = args.setBorn
      try {
        await author.save()
      } catch(error) {
        throw new ApolloError(error.message, {
          invalidArgs: args
        })
      }
      const books = await Book.find({ author: author._id })
      author.bookCount = books.length
      return author
    },

    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const user = new User({ ...args, passwordHash })
      try {
        await user.save()
      } catch(error) {
        throw new ApolloError(error.message, {
          invalidArgs: args
        })
      }
      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username})
      const correctPassword = user === null ? false : await bcrypt.compare(args.password, user.passwordHash)
      
      if(!(user && correctPassword)){
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, config.jwt_sign_secret) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.jwt_sign_secret)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
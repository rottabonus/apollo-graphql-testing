module.exports = {
    isValidAuthorName: function (author){
        return typeof author === 'string' && author.length >= 4
    },
  
    isValidBookTitle: function (title){
    return typeof title === 'string' && title.length >= 2
  }
};
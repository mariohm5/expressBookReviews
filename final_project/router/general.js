const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to filter by book detail (author, title)
const filterBooksByDetail = (detail, value) => {
    let results = [];  
    for (let [isbn, book] of Object.entries(books)) {
      if(book[detail] == value){
        results.push(book);
      }
    }
    return results;
};

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if(book){
    res.send(JSON.stringify(book, null, 4));
  }
  res.status(404).json({message: `The book with ISBN ${req.params.isbn} was not found.`});
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return res.send(JSON.stringify(filterBooksByDetail("author", req.params.author)));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return res.send(JSON.stringify(filterBooksByDetail("title", req.params.title)));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

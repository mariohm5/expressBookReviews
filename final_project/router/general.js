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

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

public_users.post("/register", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
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
  return res.send(JSON.stringify(filterBooksByDetail("author", req.params.author), null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return res.send(JSON.stringify(filterBooksByDetail("title", req.params.title), null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if(book){
    res.send(JSON.stringify(book.reviews, null, 4));
  }
  res.status(404).json({message: `The book with ISBN ${req.params.isbn} was not found.`});
});

module.exports.general = public_users;

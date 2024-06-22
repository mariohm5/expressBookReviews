const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
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
const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};
public_users.get('/',function (req, res) {
    getAllBooks().then((books)=>{ return res.send(JSON.stringify(books, null, 4))});
});

//Filter by ISBN
const filterBooksByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        console.log("Promise ISBN");
        let book = books[isbn];
        if(book){
            resolve(book);
        }
        reject(`The book with ISBN ${isbn} was not found.`);
    });
};
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    console.log(req.params.isbn);
    filterBooksByISBN(req.params.isbn)
    .then(
        (filteredBooks) => {return res.send(JSON.stringify(filteredBooks, null, 4));}
    ).catch(
        (errorMessage) => {console.log(errorMessage);return res.status(404).json({message: errorMessage});}
    );
});

// Function to filter by book detail (author, title)
const filterBooksByDetail = (detail, value) => {
    return new Promise((resolve, reject) => {
        let results = [];  
        for (let [isbn, book] of Object.entries(books)) {
            if(book[detail] == value){
                results.push(book);
            }
        }
        resolve(results);
    });
};
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    filterBooksByDetail("author", req.params.author).then((filteredBooks) => {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    filterBooksByDetail("title", req.params.title).then((filteredBooks) => {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if(book){
    return res.send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({message: `The book with ISBN ${req.params.isbn} was not found.`});
});

module.exports.general = public_users;

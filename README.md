# BookNotes test example

This project is an exercise of a web development course. The goal here is to store the notes from books you've read.
It is a register of the name, the author, the notes about the book, the date you've read and a rating. This is a Node.js project with `express`, `ejs`, `axios` and `pg` modules. It stores the data in a `PostgresSQL` database.

### How to use

1. Run `npm i`
2. Run `node index.js`
3. Access `localhost:3000`

It utilizes the Open Library Covers API to fetch book covers.
- https://openlibrary.org/dev/docs/api/covers

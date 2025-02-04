import express, { query } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';
import 'dotenv/config';

const app = express();
const port = process.env.PORT;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded( {extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

let items;
let sortType        = "rating"; // rating | date | title
let sortDirection   = "desc";   // asc | desc

app.get("/", async (req,res) => {

    // List of valid columns for sorting
    const validColumns = ['date_read', 'title', 'rating'];
    // List of valid directions
    const validDirections = ['asc', 'desc'];

    // Validate sortType and sortDirection
    if (!validColumns.includes(sortType)) {
        sortType = 'date_read';  // Default to a date
    }

    if (!validDirections.includes(sortDirection)) {
        sortDirection = 'desc';  // Default to ascending order
    }

    try {
        const result = await db.query(`select id, title, author, date_read, date_created, date_modified, note, rating, isbn, cover_id from books
                                        order by ${sortType} ${sortDirection}`);
        items = result.rows;
        
        res.render("index.ejs", { listItems: items , sortType: sortType , sortDirection: sortDirection}); //searchItems: searchItems, searchValue: searchValue
    } catch (err) {
        console.log(err);
    }

    //res.render("index.ejs",{ books: ''});
});

app.post("/", async (req,res) => {
    const type = req.body.sortType;
    if (sortType == type) {
        sortDirection   = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortType    = type;
        sortDirection   = 'desc';
    }
    
    res.redirect("/");
})

app.post("/search", async (req,res) => {
    
    const value = req.body.searchValue;

    searchValue = value;

    //console.log(value);
    if (value == "") {
        res.render("index.ejs", { searchValue: value, covers: null, listItems: items });
        return;
    }

    const url = `https://openlibrary.org/search.json?q=${value}&limit=10`;
    //console.log(url);
    
    // Response:
    // {
    //     "numFound": 3,
    //     "start": 0,
    //     "numFoundExact": true,
    //     "docs": []

    // doc[]
    //    "author_name": [""]
    //    "cover_edition_key": "OL45133299M",
    //    "cover_i": 13122431,
    //    "first_publish_year": 2015,

    try{
        const response  = await axios.get(url);
        const result    = response.data;

        console.log(`found: ${result.numFound} | docs: ${result.docs.length}`);
        res.render("index.ejs", { searchValue: value, covers: result.docs, listItems: items });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", { error: error.message });
    }
});

app.post("/add", async (req,res) => {

    const title     = req.body.title;
    const author    = req.body.author;
    const date      = req.body.date;
    const rating    = req.body.rating;
    const note      = req.body.note;
    const isbn      = req.body.isbn;
    const cover_id  = req.body.cover_id;

    if (title == '' || author == '') {
        console.log("Campos em brando");
        // res.render("index.ejs", { listItems: items });
        res.redirect("/");
    } else {
        try{
            const result = await db.query(`insert into books(title, author, date_read, date_created, date_modified, note, rating, isbn, cover_id)
                                            values($1,$2,$3,current_date,current_date,$4,$5,'',$6);`,[title,author,date,note,rating,cover_id]);

            res.send({message: "'Salvo com sucesso!'"});
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

});

app.post("/edit", async (req,res) => {

    const id        = req.body.id;
    const title     = req.body.title;
    const author    = req.body.author;
    const date      = req.body.date;
    const rating    = req.body.rating;
    const note      = req.body.note;
    const isbn      = req.body.isbn;
    const cover_id  = req.body.cover_id;

    if (title == '' || author == '') {
        console.log("Campos em brando");
        // res.render("index.ejs", { listItems: items });
        res.redirect("/");
    } else {
        try{
            const result = await db.query(`update books
                                            set title = ($2),
                                                author = ($3),
                                                date_read = ($4),
                                                --date_created,
                                                date_modified = current_date,
                                                rating = ($5),
                                                note = ($6),
                                                isbn = '',
                                                cover_id = ($7)
                                            where id = $1;`,[id,title,author,date,rating,note,cover_id]);
            
            //res.redirect('/');
            res.send({message: "'Salvo com sucesso!'"});
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

});

app.post("/delete", async (req,res) => {
    const id = req.body.deleteId;

    try {
        const result = await db.query(`delete from books where id = $1`,[id]);
        res.send({message: ""});
    } catch (err) {
        console.log(err);
        res.send({message: err});
    }

    //res.send({message: "'Apagado com sucesso!'"});
    //res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
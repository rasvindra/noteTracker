const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid")

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

// HTML ROUTES
app.get("/", (req, res)=>
    res.sendFile(path.join(__dirname, "./public/index.html"))
);
app.get("/notes", (req, res)=>
    res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// API ROUTES
app.get("/api/notes",(req,res)=>{
    let notes = JSON.parse(fs.readFileSync("./db/db.json","utf8"));
    res.json(notes);
});
// API route for adding/posting new items to DB
app.post("/api/notes",(req,res)=>{
    let notes = JSON.parse(fs.readFileSync("./db/db.json","utf8"));
    let newNote = req.body;
    newNote.id = uuid();
    let updatedNotes = [...notes,newNote];
    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotes))
    res.json(updatedNotes);
});

// API ROUTE for delete method to remove items from DB
app.delete("/api/notes/:id",(req,res)=>{
    let notes = JSON.parse(fs.readFileSync("./db/db.json","utf8"));
    let newNote = req.params.id 
    let indextoRemove = notes.findIndex(function(element){
        return element.id===newNote
    }) 
    notes.splice(indextoRemove,1)
    // Splice to remove

    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes)


});

app.listen(PORT, () => 
console.log(`App listening at http://localhost:${PORT}`)
);

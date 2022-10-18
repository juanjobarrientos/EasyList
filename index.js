const express = require("express")
const pool = require("./db.js")
const path = require("path")
const bp = require("body-parser")
const morgan = require("morgan")
require("ejs")

//variables for the index
const app = express()
const port = 8000
const usuario = "juanjo"
const contrasena = 12345
let logged = false

//settings
app.set("views",path.join(__dirname, "views"))
app.set("view engine", "ejs")

//middlewares
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(morgan("tiny"))

//routes
app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.post("/login",(req,res)=>{
    if (req.body.username == usuario) {
        if (req.body.password == contrasena) {
            res.redirect("/works")
            logged = true
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
})

//protected middleware
app.use(function(req, res, next) {
    if (logged == true) {
        next()
    } else {
        res.redirect("/")
    }
})

//protected routes
app.get("/works",async (req,res)=>{
    const result = await pool.query("SELECT * FROM works as tareas")
    res.render("works.ejs",{
        result
    })
})

app.get("/create",(req,res)=>{
    res.render("createWork.ejs")
})

app.get("/delete/:id",async(req,res)=>{
    let idToDelete = req.params.id
    const deleteable = await pool.query("DELETE FROM works WHERE id=?",idToDelete)
    res.redirect("/works")
})

app.get("/edit/:id", async (req, res) => {
    const editable = await pool.query("SELECT * FROM works WHERE id =?", req.params.id)
    let result = editable[0]
    res.render("edit.ejs",{
        result
    })
})

app.get("/loggout",(req, res) => {
    logged=false
    res.redirect("/")
})

app.post("/edit",async(req, res) => {
    let idToEdit = req.body.id
    let date = `${req.body.dia}-${req.body.mes}-${req.body.ano}`
    let workToApply = req.body.tarea
    const query = await pool.query(`UPDATE works SET tarea = "${workToApply}", fecha ="${date}" WHERE id= ${idToEdit}`,)
    res.redirect("/works")
})
app.post("/create",async(req,res)=>{
    let work = req.body.tarea
    let date = `${req.body.dia}-${req.body.mes}-${req.body.ano}`
    const creation = await pool.query(`INSERT INTO works(tarea, estado, fecha) VALUES ("${work}",${0},"${date}")`)
    res.redirect("/works")
})

app.listen(port)
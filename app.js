const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let allMusic = [];
let history = [];
let playlist = [];
let playlistsongs= [];
var list=[];
var isLogged = false;


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sujanbannu',
    database: 'user1'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
})

connection.query('SELECT * FROM songs', function (err, result) {
    if (err) throw err;
    allMusic = result;
    console.log(allMusic);
});


let index = Math.floor(Math.random() * allMusic.length);

var email = "";
var check1 = "Please Login or Register";
var check3 = "Email not registered";
var check4 = "Incorrect password";


app.get("/", function(req, res){
    if(isLogged === false){
    res.render("home",{songslist: allMusic});
    }
    else{
        connection.query('select * from playlist where email = ?', [email], function (err, result) {
            if (err) throw err;
            playlist = result;
            console.log(playlist);
        });
        connection.query('select distinct(playlistname) from playlist where email = ?', [email], function (err, result) {
            if (err) throw err;
            list = result;
            console.log(list);
        });
        connection.query('SELECT * from users where email = ?', [email], function (err, result) {
            if (err) throw err;
            var name = result[0].name;
            res.render("home-login",{songslist: allMusic, username: name});
        });
    }
});

app.get("/songs", function(req, res){
    if(isLogged === true){
        connection.query('select * from playlist where email = ?', [email], function (err, result) {
            if (err) throw err;
            playlist = result;
            console.log(playlist);
        });
    res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list});
    }
    else{
        res.redirect("/login");
    }
});

app.get("/login", function(req, res){
    res.render("login",{check: check1});
});

app.get("/history", function(req, res){
    if(isLogged === true){
        connection.query('SELECT * from history where email = ?', [email], function (err, result) {
            if (err) throw err;
            history = result;
            console.log(history);
        });
        connection.query('SELECT * from users where email = ?', [email], function (err, result) {
            if (err) throw err;
            var name = result[0].name;
            res.render("history",{historysongslist: history, username: name});
        });
    }
    else{
        res.redirect("/login");
    }
});



app.get("/playlist", function(req, res){
    if(isLogged === true){
        connection.query('select distinct(playlistname) from playlist where email = ?', [email], function (err, result) {
            if (err) throw err;
            list = result;
            console.log(list);
        });
        connection.query('SELECT * from users where email = ?', [email], function (err, result) {
            if (err) throw err;
            var name = result[0].name;
            res.render("playlist",{playlists: list, username: name});
        });

    }
});

app.get("/playlist-songs", function(req, res){
    if(isLogged === true){
        connection.query('SELECT * from playlist where email = ? and playlistname = ?', [email,req.body.playlistname], function (err, result) {
            if (err) throw err;
            playlistsongs = result;
            console.log(playlist);
        });
        connection.query('SELECT * from users where email = ?', [email], function (err, result) {
            if (err) throw err;
            var name = result[0].name;
            res.render("playlist-songs",{playlistname: req.body.playlistname, username: name,playlistsongs: playlistsongs});
        });
    }
    else{
        res.redirect("/login");
    }
});
            


app.post("/", function(req, res){
    if(req.body.reg==="logi"){
        connection.query('SELECT * from users where email = ?', [req.body.email], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                res.render("login",{check: check3});
            }
            else{
                if(result[0].password === req.body.password){
                    isLogged = true;
                    email = req.body.email;
                    res.redirect("/");
                }
                else{
                    res.render("login",{check: check4});
                }
            }
        });
    }
    else if(req.body.reg==="regist"){
        connection.query('Insert into users (name,email,password) values(?,?,?)', [req.body.name,req.body.email,req.body.password], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        isLogged = true;
        email = req.body.email;
        res.redirect("/");
    }
    else if(req.body.home === "logout"){
        isLogged = false;
        res.redirect("/");
    }
});
        



app.post("/login", function(req, res){
    res.render("login",{check: check1});
});

app.post("/songs", function(req, res){
    if(isLogged){
    if(req.body.control === "next"){
        index++;
        if(index >= allMusic.length){
            index = 0;
        }
        connection.query('Insert into history (email,artistname,songname) values(?,?,?)', [email,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list});
    }
    else if(req.body.control === "prev"){
        index--;
        if(index < 0){
            index = allMusic.length - 1;
        }
        connection.query('Insert into history (email,artistname,songname) values(?,?,?)', [email,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list});
    } else if(req.body.addold === "addold"){
        connection.query('Insert into playlist (email,playlistname,artistname,songname) values(?,?,?,?)', [email,req.body.playlistname,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            playlist.push({email: email, playlistname: req.body.playlistname, songname: allMusic[index].name});
        });
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list});
    } else if(req.body.addnew === "addnew"){
        console.log(req.body.playlistname);
        connection.query('Insert into playlist (email,playlistname,artistname,songname) values(?,?,?,?)', [email,req.body.playlistname,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            playlist.push({email: email, playlistname: req.body.playlistname, songname: allMusic[index].name});
        });
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list});
    }
    else {
        allMusic.forEach(function(song){
            if(song.name === req.body.song){
                index = allMusic.indexOf(song);
            }
        });
        connection.query('Insert into history (email,artistname,songname) values(?,?,?)', [email,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list});
}
    }
    else{
        res.redirect("/login");
    }

});

app.post("/history", function(req, res){
    if(isLogged===true){
        res.redirect("/history");
    }
    else{
        res.redirect("/login");
    }
});


app.post("/playlist", function(req, res){
    if(isLogged===true){
        if(req.body.home=== "playlist"){
            res.redirect("/playlist");
        }
        else if(req.body.create === "create"){
            connection.query('insert into playlist (email,playlistname,artistname,songname) values(?,?,NULL,NULL)', [email,req.body.playlistname], function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
            res.redirect("/playlist");
        }
    }
    else{
        res.redirect("/login");
    }
});

app.post("/playlist-songs", function(req, res){
    connection.query('SELECT * from playlist where email = ? and playlistname = ?', [email,req.body.playlistname], function (err, result) {
        if (err) throw err;
        playlistsongs = result;
        console.log(playlist);
    });
    connection.query('SELECT * from users where email = ?', [email], function (err, result) {
        if (err) throw err;
        var name = result[0].name;
        res.render("playlist-songs",{playlistname: req.body.playlistname, username: name,playlistsongs: playlistsongs});
    });
});







app.listen(3000, function(){
    console.log("Server started on port 3000");
});




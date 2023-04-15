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
    host: 'sujan.c5rlvnugwvna.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'stereoheart',
    database: 'sujan'
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
var check5 = "Email already registered";
var checksong1 = "";
var checksong2 = "Song already in playlist"; 
var checksong3 = "Song added to playlist";
var like1 = "like";
var like2 = "liked";


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
        connection.query('select * from liked where email= ? and songname = ?', [email,allMusic[index].name], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like1});
            }
            else{
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like2});
            }
        });
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

app.get("/profile", function(req, res){
    if(isLogged === true){
        connection.query('SELECT * from users where email = ?', [email], function (err, result) {
            if (err) throw err;
            var name = result[0].name;
            res.render("profile",{username: name,email: email});
        });
    }
    else{
        res.redirect("/login");
    }
});

app.get("/liked",function(req,res){
    if(isLogged === true){
        connection.query('SELECT * from liked where email = ?',[email], function (err,result){
            if (err) throw err;
            var liked = result;
            res.render("liked",{likedsongs: liked});
        })
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
        connection.query('SELECT * from users where email = ?', [req.body.email], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                connection.query('Insert into users (name,email,password) values(?,?,?)', [req.body.name,req.body.email,req.body.password], function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
                isLogged = true;
                email = req.body.email;
                res.redirect("/");
            }
            else{
                res.render("login",{check: check5});
            }
        });
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

        
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like1});
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
        
        connection.query('select * from liked where email= ? and songname = ?', [email,allMusic[index].name], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like1});
            }
            else{
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like2});
            }
        });
        } else if(req.body.addold === "addold"){
        connection.query('SELECT * from playlist where email = ? and playlistname = ? and songname = ?', [email,req.body.playlistname,allMusic[index].name], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                connection.query('Insert into playlist (email,playlistname,artistname,songname) values(?,?,?,?)', [email,req.body.playlistname,allMusic[index].artist,allMusic[index].name], function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    playlist.push({email: email, playlistname: req.body.playlistname, songname: allMusic[index].name});
                });
                connection.query('select * from liked where email= ? and songname = ?', [email,allMusic[index].name], function (err, result) {
                    if (err) throw err;
                    if(result.length === 0){
                        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong3,like:like1});
                    }
                    else{
                        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong3,like:like2});
                    }
                });
             }
            else{
                connection.query('select * from liked where email= ? and songname = ?', [email,allMusic[index].name], function (err, result) {
                    if (err) throw err;
                    if(result.length === 0){
                        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong2,like:like1});
                    }
                    else{
                        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong2,like:like2});
                    }
                });  
              }
        });
    } else if(req.body.addnew === "addnew"){
        console.log(req.body.playlistname);
        connection.query('Insert into playlist (email,playlistname,artistname,songname) values(?,?,?,?)', [email,req.body.playlistname,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            playlist.push({email: email, playlistname: req.body.playlistname, songname: allMusic[index].name});
        });
        connection.query('select * from liked where email= ? and songname = ?', [email,allMusic[index].name], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong3,like:like1});
            }
            else{
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong3,like:like2});
            }
        });
        }
    else if(req.body.like === "like"){
        connection.query('Insert into liked (email,artistname,songname) values(?,?,?)', [email,allMusic[index].artist,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like2});
    }
    else if(req.body.like === "liked"){
        connection.query('delete from liked where email = ? and songname = ?', [email,allMusic[index].name], function (err, result) {
            if (err) throw err;
            console.log("1 record deleted");
        });
        res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like1});
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
        
        connection.query('select * from liked where email= ? and songname = ?', [email,allMusic[index].name], function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like1});
            }
            else{
                res.render("songs", {img: allMusic[index].name,sname: allMusic[index].name,audio: allMusic[index].name,artist: allMusic[index].artist,playlists: list,checkplaylist:checksong1,like:like2});
            }
        });
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

app.post("/search", function(req, res){
    if(isLogged===true){
        if(req.body.home === "search"){
            var searchresults = [];
            res.render("search",{songslist: allMusic,searchresults: searchresults});
        }
        else if(req.body.searchbutton === "searchbutton"){
            var songs =[]
            connection.query('SELECT * from songs where name LIKE ?', ['%'+req.body.input+'%'], function (err, result) {
                if (err) throw err;
                var searchresults = result;
                res.render("search",{songslist: allMusic,searchresults: searchresults});
            });
        }

    }
    else{
        res.redirect("/login");
    }
});

app.post("/profile", function(req, res){
    if(isLogged===true){
        if(req.body.home === "profile"){
            res.redirect("/profile");
        }
    }
    else{
        res.redirect("/login");
    }
});

app.post("/liked", function(req, res){
    if(isLogged===true){
        if(req.body.home === "liked"){
            res.redirect("/liked");
        }
    }
    else{
        res.redirect("/login");
    }
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});




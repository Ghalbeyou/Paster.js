const express = require('express');
const app = express();
const fs = require('fs');
app.set('view engine', 'ejs');
// this allows you to render .html files as templates in addition to .ejs
app.engine('html', require('ejs').renderFile);
var pastes = [];
fs.readFile('pastes.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err);
    }
    pastes = JSON.parse(data);
});
app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.render(__dirname + '/index.html', { pastes: pastes.length});
})

app.get('/write', (req, res) => {
    // req.header('location', '/new');
    res.redirect('/new');
    res.send("Redirecting")
    // redirect to /new
})

app.get('/new', (req, res) => {
    res.sendFile(__dirname + '/write.html');
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
})

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/contact.html');
})

app.get('/newpaste', (req, res) => {
    if(req.query.title == '' || req.params.body == '') {
        res.send("Please fill in all fields");
    }
    var newPaste = {
        title: req.query.title,
        content: req.query.body,
        date: new Date()
        }
        pastes.push(newPaste);
        fs.writeFile('pastes.json', JSON.stringify(pastes), function (err) {
            if (err) {
                console.log(err);
            }
        }
        );
        res.send(`${newPaste.title} has been saved!<br/>Link to it: <a href="/pastes/${pastes.length}">/pastes/${pastes.length}</a>`);
})

app.get('/pastes/:id', (req, res) => {
    var id = req.params.id;
    if (id > pastes.length) {
        res.send("Paste does not exist");
    }
    if (id < 0 || id == '' || id == 0) {
        res.send("Paste does not exist");
    }
    var paste = pastes[id-1];
    res.render(__dirname + '/read.html', { paste: paste });
})

app.get('/style.css', (req, res) => {
    // check if the request is from the app
    // if (req.headers.referer.includes('localhost:3000')) {
        res.sendFile(__dirname + '/css/style.css');
})

// 404 error handler
app.use((req, res) => {
    res.status(404).render(__dirname + '/Error/404.html', { error: "Page not found", url: req.url });
})
app.listen(3000, () => {
    console.log('Paster.js app listening on port 3000!');
})
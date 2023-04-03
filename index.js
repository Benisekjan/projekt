
const express = require("express");

const bodyParser = require("body-parser"); 

const moment = require("moment"); 
const csvtojson = require("csvtojson");

const fs = require("fs"); 
const path = require("path");


const app = express();

const port = 3000;


app.use(express.static("public"));

app.set("view engine", "pug"); 

app.set("views", path.join(__dirname, "views"));

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let narozeni = moment().format('YYYY-MM-DD');
app.post('/savedata', urlencodedParser, function (req, res) {
    let data = `"${req.body.jmeno}","${narozeni}","${req.body.pohlavi}","${req.body.film}"\n`;
    fs.appendFile(path.join(__dirname, 'data/ukoly.csv'), data, function (err) {
        if (err) {
            console.log('Nastala chyba: ', err);
            return res.status(400).json({
                success: false,
                message: 'Nastala chyba při zápisu do souboru!'
            });
        };
        res.redirect(301, '/');
    });
})


app.get("/todolist", (req, res) => { 
    /* Použití knihovny csvtojson k načtení dat ze souboru ukoly.csv. Atribut headers zjednodušuje pojmenování jednotlivých datových sloupců. */ /* Pro zpracování je použito tzv. promises, které pracují s částí .then (úspěšný průběh operace) a .catch (zachycení možných chyb) */ 
    csvtojson({headers:['jmeno','pohlavi','narozeni','film']}).fromFile(path.join(__dirname, 'data/ukoly.csv')) 
    .then(data => { 
      /* Vypsání získaných dat ve formátu JSON do konzole */ 
      console.log(data); 
      /* Vykreslení šablony index.pug i s předanými daty (objekt v druhém parametru) */ 
      res.render('index', {nadpis: "Seznam úkolů", ukoly: data}); 
    }) 
    .catch(err => { 
     
      console.log(err); 
    
      res.render('error', {nadpis: "Chyba v aplikaci", chyba: err}); 
    }); 
  });


app.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}`);
});

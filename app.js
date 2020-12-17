require('dotenv').config();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const base64json = require('base64json');

const admin = require("firebase-admin");
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

let port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

const db = admin.firestore();

// TODO: read once from the database and store that information in the backend

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sample", (req, res) => {
  res.render("sample");
});

app.post("/sample", (req, res) => {
  res.redirect("/loading");
});

app.get("/loading", (req, res) => {
  let textArray = ["Mining Bitcoin", "Retrieving Information", "Analyzing Data", "Exploring Virtual Reality", "Lowering Bandwidth", "Finding a Unicorn", "Meatifying your Day", "Disrupting the Meat Industry", "Big Data being Utilized", "Artificial Intelligence at Work", "Robots Tinkering", "Chickens being Slaughtered", "Extrapolating Data"];
  res.render("loading", {loadingTexts: textArray});
});

app.get("/result", (req, res) => {
  let subtitleArray = ["Have you tried Chicken Breast?", "Have you given Chicken Breast a try?", "What about Chicken Breast?", "Chicken Breast fits your needs", "It looks like you may need some Chicken Breast", "Chicken Breast needs you", "Poultry is the best choice", "Chicken Breast is the best choice"];
  let subtitle = subtitleArray[Math.floor(Math.random() * subtitleArray.length)]

  const getResultText = async() => {
    let fact = getRandomItemInCollection("facts", "fact");
    let recipe = getRandomItemInCollection("recipes", "recipe");
    // let subtitle = getRandomItemInCollection("subtitles", "subtitle");
    return await Promise.all([fact, recipe]);
  }

  getResultText().then(data => {
    
    res.render("result", {funFact: data[0], recipeOfTheDay: data[1], subtitle: subtitle})
  });

});

function getRandomItemInCollection(collectionName, documentName){
  return new Promise((resolve, reject) => {
    db.collection(collectionName).get().then((snapshot) => {
      let collectionSize = snapshot.size;
      let random = Math.floor(Math.random() * collectionSize);
      let itemArray = [];
  
      snapshot.forEach((doc) => {
        itemArray.push(doc.data());
      });
      randomItem = itemArray[random]
      resolve(randomItem[documentName])
  
    }).catch((err) => {
      console.log("error getting documents", err);
      if (documentName === "fact"){
        resolve("This type of poultry is an excellent source of lean protein!");
      } else if (documentName === "recipe") {
        resolve("https://www.gimmesomeoven.com/baked-chicken-breast/");
      } else if (documentName === "subtitle") {
        resolve("Have you given Chicken Breast's a try?");
      } else {
        reject("Error")
      }
    });
  })
}

app.use((req, res, next) => {
  res.status(404).render("404");
})

app.listen(port, () => {
  console.log(`Server has started succesfully on port: ${port}`);
});
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        let response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php?apiKey=1");
        const data = response.data.meals[0];
        const tags = data.strTags;
        let tagList = [];
        const ingredients = Object.keys(data).filter(k => k.includes('strIngredient')).map(k => data[k]);
        const measures = Object.keys(data).filter(k => k.includes('strMeasure')).map(k => data[k]);
        const instructions = data.strInstructions.split("\r\n");

        if (tags) {
            tagList = tags.split(",");
        }

        res.render("index.ejs", {
            data,
            tagList,
            ingredients,
            measures,
            instructions
        });
    } catch (error) {
        res.status(500);
    }
});

app.post("/", async (req, res) => {
    try {
        let selectedOption = req.body.category;
        let mealList = {};
        let response = {};
        const category = req.body.category;

        if (category === "") {
            response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php?apiKey=1");
        } else {
            mealList = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);

            const meals = mealList.data.meals;
            let mealIDs = meals.map(a => a.idMeal);
            const mealID = mealIDs[Math.floor(Math.random() * mealIDs.length)];
            response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        }

        const data = response.data.meals[0];
        const tags = data.strTags;
        let tagList = [];
        const ingredients = Object.keys(data).filter(k => k.includes('strIngredient')).map(k => data[k]);
        const measures = Object.keys(data).filter(k => k.includes('strMeasure')).map(k => data[k]);
        const instructions = data.strInstructions.split("\r\n");

        if (tags) {
            tagList = tags.split(",");
        }

        res.render("index.ejs", {
            data,
            tagList,
            ingredients,
            measures,
            instructions,
            selectedOption
        });
    } catch (error) {
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})
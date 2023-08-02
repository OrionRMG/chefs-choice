import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        let response = await axios.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken");
        const result = JSON.stringify(response.data);

        res.render("test.ejs", {
            result
        });
    } catch (error) {
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})
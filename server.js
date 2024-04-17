"use strict";

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

/* Express & cors */
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

/* Anslutning till MongoDB */
mongoose.connect(`mongodb+srv://jocke:${process.env.PASSWORD}@moment3.nkbhbmk.mongodb.net/?retryWrites=true&w=majority&appName=moment3`).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => {
    console.log('Error connecting to database: ' + error);
})
 
/* Schema */
const workSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

const WorkExperience = mongoose.model('WorkExperience', workSchema);

/* Välkommen route */
app.get('/api', (req, res) => {
    res.json({ message: "Welcome to my API for managing work experiences. Created by Joakim" });
});

/* Route för att hämta alla arbetserfarenheter */
app.get('/api/work-experiences', async (req, res) => {
    try {
        let result = await WorkExperience.find();

        return res.json(result);
    } catch(error) {
        return res.status(500).json(error);
    }
});

/* Route för att hämta en specifik arbetserfarenhet */
app.get('/api/work-experiences/:id', (req, res) => {
    const id = req.params.id;
    /* SQL-Fråga som hämtar specifikt ID från databasen. */
    client.query("SELECT * FROM workexperiences WHERE id = $1", [id], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving work experience." });
        } else {
            /* Kontrollerar ifall där finns data i databasen */
            if (result.rows.length === 0) {
                res.status(404).json({ message: "No work experiences found for that specific ID." });
            } else {
                res.json(result.rows[0]);
            }
        }
    });
});

/* Route för att lägga till en arbetserfarenhet */
app.post("/api/work-experiences", async (req, res) => {
    try {
        /* Lägger till värde i databas */
        let result = await WorkExperience.create(req.body);

        return res.json(result);
    } catch(error) {
        return res.status(400).json(error);
    }
});

/* Route för att ändra/uppdatera en arbetserfarenhet */
app.put("/api/work-experiences/:id", (req, res) => {
    const id = req.params.id;
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    /* Uppdatera i databasen */
    client.query("UPDATE workexperiences SET companyname = $1, jobtitle = $2, location = $3, startdate = $4, enddate = $5, description = $6 WHERE id = $7",
        [companyname, jobtitle, location, startdate, enddate, description, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error updating work experience." });
            }
            res.status(200).json({ message: "Work experience updated successfully." })
        }
    );
});

/* Route för att ta bort arbetserfarenhet */
app.delete("/api/work-experiences/:id", (req, res) => {
    const id = req.params.id;
    /* SQL-fråga som tar bort ID från databas */
    client.query("DELETE FROM workexperiences WHERE id = $1",
    [id],
    (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting work experience."})
        }
        res.status(200).json ({ message: "Work experience deleted successfully. "})
    })
});
/* Startar & lyssnar på port */
app.listen(port, () => {
    console.log('Server is running on port ' + port);
})


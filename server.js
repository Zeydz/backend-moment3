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
    }
}, { timestamps: true });

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
app.get('/api/work-experiences/:id', async (req, res) => {
    const id = req.params.id;
     /* Extra validation */
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Work experience not found. '})
    }
    try {
        let result = await WorkExperience.findById(id);

        return res.json(result);
    } catch(error) {
        return res.status(500).json(error);
    }
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
app.put("/api/work-experiences/:id", async (req, res) => {
    const id = req.params.id;
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;
   /* Extra validation */
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Work experience not found. '})
    }
    /* Uppdatera i databasen */
    try {
        const updatedExperience = await WorkExperience.findByIdAndUpdate(id, {
            companyname, 
            jobtitle,
            location,
            startdate,
            enddate,
            description
        }, { new: true });
        /* Extra validation */
        res.status(200).json({ message: 'Work experience updated successfully', data: updatedExperience});
    } catch(error) {
        res.status(500).json({ message: 'Error updating work experience ' + error});
    }
});

/* Route för att ta bort arbetserfarenhet */
app.delete("/api/work-experiences/:id", async (req, res) => {
    const id = req.params.id;
    /* Extra validation */
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Work experience not found. '})
    }
    /* Ta bort ID */
    try {
        const deletedExperience = await WorkExperience.findByIdAndDelete(id);
        res.status(200).json({ message: 'Work experience deleted successfully.'})
    } catch(error) {
        res.status(500).json({ message: 'Error deleting work experience ' + error});
    }
});

/* Startar & lyssnar på port */
app.listen(port, () => {
    console.log('Server is running on port ' + port);
})


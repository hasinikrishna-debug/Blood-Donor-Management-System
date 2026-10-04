const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataPath = path.join(__dirname, "../data/donors.json");

function getDonors() {
    if (!fs.existsSync(dataPath)) {
        return [];
    }

    const data = fs.readFileSync(dataPath, "utf8");

    return data ? JSON.parse(data) : [];
}

function saveDonors(donors) {
    fs.writeFileSync(
        dataPath,
        JSON.stringify(donors, null, 2)
    );
}


// GET all donors
router.get("/", (req, res) => {
    try {
        const donors = getDonors();

        res.json({
            success: true,
            donors
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load donors."
        });
    }
});


// Search donors by blood group
router.get("/search", (req, res) => {
    try {
        const bloodGroup = req.query.bloodGroup;

        const donors = getDonors();

        if (!bloodGroup) {
            return res.json({
                success: true,
                donors
            });
        }

        const results = donors.filter(
            donor =>
                donor.bloodGroup.toLowerCase() ===
                bloodGroup.toLowerCase()
        );

        res.json({
            success: true,
            donors: results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Search failed."
        });
    }
});


// Add donor
router.post("/", (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            bloodGroup,
            phone,
            city
        } = req.body;

        if (
            !name ||
            !age ||
            !gender ||
            !bloodGroup ||
            !phone ||
            !city
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const donors = getDonors();

        const newDonor = {
            id: Date.now().toString(),
            name,
            age,
            gender,
            bloodGroup,
            phone,
            city,
            createdAt: new Date().toISOString()
        };

        donors.push(newDonor);

        saveDonors(donors);

        res.status(201).json({
            success: true,
            message: "Donor registered successfully.",
            donor: newDonor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to register donor."
        });
    }
});


// Delete donor
router.delete("/:id", (req, res) => {
    try {
        const donors = getDonors();

        const updatedDonors = donors.filter(
            donor => donor.id !== req.params.id
        );

        if (updatedDonors.length === donors.length) {
            return res.status(404).json({
                success: false,
                message: "Donor not found."
            });
        }

        saveDonors(updatedDonors);

        res.json({
            success: true,
            message: "Donor deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to delete donor."
        });
    }
});


module.exports = router;
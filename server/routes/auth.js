const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from HOME")
})

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        res.status(422).json({error: "Please fill all the fields"})
    }
    res.json({message: "Successfully Posted"})
})

module.exports = router;
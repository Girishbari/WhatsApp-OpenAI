const express = require("express");
const bodyParser = require("body-parser");


const router = express.Router();
router.use(bodyParser.json());

let NOTION_TOKEN = '';
let dbID = '';
// let groupName = '';


router.post('/getNotionDetail', (req, res) => {
    if (req.body) {
        NOTION_TOKEN = req.body.NOTION_TOKEN;
        dbID = req.body.dbID;
        // groupName = req.body.groupName;
        res.json({ message: 'updated' });
    } else {
        res.status.json({ message: "error " });
    }
});

module.exports = router
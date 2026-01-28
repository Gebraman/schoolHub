const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
app.get('/', (req, res) => {
    res.send("the schoolhub server is running here")

})
app.listen(port, () => {
    console.log(`the schoolhub server is running on port ${port}`)
})
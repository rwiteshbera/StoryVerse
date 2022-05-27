const express = require('express')
const app = express();
const PORT = 5050 || process.env.PORT;
const mongoose = require('mongoose');
const {MONGO_URI} =  require('./keys');


require('./models/user');
app.use(express.json());
app.use(require("./routes/auth"));

mongoose.connect(MONGO_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
mongoose.connection.on("connected", () => {
	console.log("Connected to mongodb!");
})
mongoose.connection.on("error", (err) => {
	console.log("ERROR! Cannot connect to database ", err);
})

app.listen(PORT, () => {
	console.log(`Server is listening at: ${PORT}`);
})

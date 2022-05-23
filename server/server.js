const express = require('express')
const http = require('http')
const app = express();
const server = http.createServer(app);
const PORT = 5050;

app.get("/", (req,res)=> {
	res.send("Hello from Server");
})

server.listen(PORT, () => {
	console.log(`Server is listening at http://localhost:${PORT}/`);
})

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require("./app")


const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server Actived on port : ${port} `);
});

process.on('unhandledRejection', err => {
    console.log('un handled Rejection');
    console.log(err);
    server.close(() => {
        process.exit(1)
    })
})
process.on('uncaughtException', err => {
    console.log('un caught Exception');
    console.log(err.name, err.message);
        process.exit(1)
})
const app = require('./src/app');

const PORT = process.env.PORT || 3056   ;

const server = app.listen(PORT, () => {
    console.log(`WS Server is running on port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('WS Server is closed');
    });
}); 
import connectDB from './config/db.js';
import express from 'express';
import usersRoutes from "./routes/users.js";


const app = express();


// middleware for json
app.use(express.json());

// middleware for users routes
app.use('/api/users/v1', usersRoutes)


//for testing
app.get('/test', (req, res)=>{
    res.status(200).send('working very well..')
})


// Connect to MongoDB and start the server
const dbConnection = await connectDB();
if (dbConnection) {
    console.log('MongoDB connected');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }); 
} else {
    console.log('MongoDB connection error');
}

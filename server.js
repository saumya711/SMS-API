// import cors from 'cors';
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const connectDB = require('./config/database');
connectDB();

// routers
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use(express.json())

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
    res.json({ msg: 'Welcome Home Page!!' })
})


app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
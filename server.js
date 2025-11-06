const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Student = require('./models/Student');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://kamaleshk_db_user:NMQ8iAFL9X1wNqru@cluster0.fyitptt.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
// Home page - list all students
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students });
});

// Add fee payment form
app.get('/add', (req, res) => {
    res.render('add');
});

// Add fee payment - POST
app.post('/add', async (req, res) => {
    const { name, class: studentClass, rollNumber, feeAmount } = req.body;
    await Student.create({ name, class: studentClass, rollNumber, feeAmount });
    res.redirect('/');
});

// Delete student record
app.post('/delete/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Edit student fee payment
app.get('/edit/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('edit', { student });
});

app.post('/edit/:id', async (req, res) => {
    const { name, class: studentClass, rollNumber, feeAmount } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, class: studentClass, rollNumber, feeAmount });
    res.redirect('/');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


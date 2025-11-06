// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student'); // Make sure you have this model

const app = express();

// ====== MONGODB CONNECTION ======
mongoose.connect('mongodb+srv://kamaleshk_db_user:kamalesh123@cluster0.fyitptt.mongodb.net/schoolFeeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// ====== MIDDLEWARE ======
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static(path.join(__dirname, 'public'))); // For static assets
app.set('view engine', 'ejs'); // EJS template engine
app.set('views', path.join(__dirname, 'views')); // Ensure correct views folder

// ====== ROUTES ======

// Home page - List all students
app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('index', { students });
    } catch (err) {
        console.error(err);
        res.send("Error fetching student records.");
    }
});

// Add fee payment form
app.get('/add', (req, res) => {
    res.render('add');
});

// Add fee payment - POST
app.post('/add', async (req, res) => {
    try {
        const { name, class: studentClass, rollNumber, feeAmount } = req.body;
        await Student.create({ name, class: studentClass, rollNumber, feeAmount, paymentDate: new Date() });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error adding student payment.");
    }
});

// Edit student fee payment form
app.get('/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.send("Student not found.");
        }
        res.render('edit', { student });
    } catch (err) {
        console.error(err);
        res.send("Error fetching student for edit.");
    }
});

// Edit student fee payment - POST
app.post('/edit/:id', async (req, res) => {
    try {
        const { name, class: studentClass, rollNumber, feeAmount } = req.body;
        await Student.findByIdAndUpdate(req.params.id, { name, class: studentClass, rollNumber, feeAmount });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error updating student payment.");
    }
});

// Delete student record
app.post('/delete/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error deleting student payment.");
    }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 3000; // Use Render's dynamic port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const eventsRouter = require('./routes/events');
const votesRouter = require('./routes/votes');

const app = express();

// MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (err) { return done(err); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try { const user = await User.findById(id); done(null, user); } 
  catch (err) { done(err); }
});

// Flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
// Routes
app.use('/', indexRouter);
app.use('/users', authRouter);
app.use('/events', eventsRouter);

// FIX: mount votes router at root so /leaders works
app.use('/', votesRouter);


// 404
app.use((req, res) => res.status(404).render('error', { message: 'Page not found' }));

// Socket.IO (optional)
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('chat message', msg => io.emit('chat message', msg));
  socket.on('disconnect', () => console.log('user disconnected'));
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

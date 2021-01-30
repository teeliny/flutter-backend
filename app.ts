var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import indexRouter from './routes';

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});


export default app;

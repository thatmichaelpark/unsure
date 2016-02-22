// http://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates
if (JSON && !JSON.dateParser) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

    /// <summary>
    /// set this if you want MS Ajax Dates parsed
    /// before calling any of the other functions
    /// </summary>
    JSON.parseMsAjaxDate = false;

    JSON.useDateParser = function(reset) {
        /// <summary>
        /// Globally enables JSON date parsing for JSON.parse().
        /// replaces the default JSON parser with parse plus dateParser extension 
        /// </summary>    
        /// <param name="reset" type="bool">when set restores the original JSON.parse() function</param>

        // if any parameter is passed reset
        if (typeof reset != "undefined") {
            if (JSON._parseSaved) {
                JSON.parse = JSON._parseSaved;
                JSON._parseSaved = null;
            }
        } else {
            if (!JSON.parseSaved) {
                JSON._parseSaved = JSON.parse;
                JSON.parse = JSON.parseWithDate;
            }
        }
    };

    JSON.dateParser = function(key, value) {
        /// <summary>
        /// Globally enables JSON date parsing for JSON.parse().
        /// Replaces the default JSON.parse() method and adds
        /// the datePaser() extension to the processing chain.
        /// </summary>    
        /// <param name="key" type="string">property name that is parsed</param>
        /// <param name="value" type="any">property value</param>
        /// <returns type="date">returns date or the original value if not a date string</returns>
        if (typeof value === 'string') {
            var a = reISO.exec(value);
            if (a)
                return new Date(value);

            if (!JSON.parseMsAjaxDate)
                return value;

            a = reMsAjax.exec(value);
            if (a) {
                var b = a[1].split(/[-+,.]/);
                return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
        }
        return value;
    };

    JSON.parseWithDate = function(json) {
        /// <summary>
        /// Wrapper around the JSON.parse() function that adds a date
        /// filtering extension. Returns all dates as real JavaScript dates.
        /// </summary>    
        /// <param name="json" type="string">JSON to be parsed</param>
        /// <returns type="any">parsed value or object</returns>
        var parse = JSON._parseSaved ? JSON._parseSaved : JSON.parse;
        try {
            var res = parse(json, JSON.dateParser);
            return res;
        } catch (e) {
            // orignal error thrown has no error message so rethrow with message
            throw new Error("JSON content could not be parsed");
        }
    };

    JSON.dateStringToDate = function(dtString, nullDateVal) {
        /// <summary>
        /// Converts a JSON ISO or MSAJAX date or real date a date value.
        /// Supports both JSON encoded dates or plain date formatted strings
        /// (without the JSON string quotes).
        /// If you pass a date the date is returned as is. If you pass null
        /// null or the nullDateVal is returned.
        /// </summary>    
        /// <param name="dtString" type="var">Date String in ISO or MSAJAX format</param>
        /// <param name="nullDateVal" type="var">value to return if date can't be parsed</param>
        /// <returns type="date">date or the nullDateVal (null by default)</returns> 
        if (!nullDateVal)
            nullDateVal = null;
            
        if (!dtString)
            return nullDateVal; // empty

        if (dtString.getTime)
            return dtString; // already a date
            
        if (dtString[0] === '"' || dtString[0] === "'")
            // strip off JSON quotes
            dtString = dtString.substr(1, dtString.length - 2);

        var a = reISO.exec(dtString);
        if (a)
            return new Date(dtString);

        if (!JSON.parseMsAjaxDate)
            return nullDateVal;

        a = reMsAjax.exec(dtString);
        if (a) {
            var b = a[1].split(/[-,.]/);
            return new Date(+b[0]);
        }
        return nullDateVal;
    };
}

JSON.useDateParser();

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/mockup', {native_parser:true});

var routes = require('./routes/index');
var customers = require('./routes/customers');
var orders = require('./routes/orders');
var inventory = require('./routes/inventory');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use( function ( req, res, next ) {
	req.db = db;
	next();
});
app.use('/', routes);
app.use('/customers', customers);
app.use('/orders', orders);
app.use('/inventory', inventory);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

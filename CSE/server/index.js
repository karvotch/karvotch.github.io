const express = require('express');
const app = express();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');

const port = 5000;
var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

async function fetchItems(searchValue) {
    console.log("Inside fetchItems");
    let targetURL = 'https://redsky.target.com/v2/plp/search/?channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&' + 'isDLP=false&keyword=' + searchValue + '&offset=0&pageId=%2Fs%2Fface+mask&pricing_store_id=294&scheduled_delivery_store_id=294&' + 'store_ids=294%2C3251%2C1362%2C183%2C1309&visitorId=0171326AB8080201BA1EC63BED54D32C&include_sponsored_search_v2=true&ppatok=AOxT33a&' + 'platform=server&key=eb2551e4accc14f38cc42d32fbc2b2eb';
    let items = fetch(targetURL)
        //.then(res => res.json())
        .then(res => {
            if(res.ok) {
                return res;
            } else {
                console.log(res);
                return 0;
            }
        })
        .then(json => {
            if(json === 0) {
                return 0;
            } else {
                json = json.json();
                console.log('Is it here?');
                console.log('2:', json);
                return json;
            }
        });
    return items;
}

function screwTarget() {
    var htmlCode = '<h2>Denied access. Thanks Target</h2>';
    return htmlCode;
}

function textToHTML(productText, number) {
    if(productText != null) {
        var htmlCode = '<div id="productDescription' + number + '" class="productsDescription"> <a id="productLink' + number + '" class="productsLink">' + productText + '</a>' + '</div>';
        return htmlCode;
    }
    // console.log(htmlCode);
    return null;
}

function imageToHTML(productImage, number) {
    if(productImage != null) {
        var htmlCode = '<div id="product' + number + '" class="products"> <div id="image' + number + '" class="productsImages">' + '<img id="productImage' + number + '" src="' + productImage + '"> <br> </div>';
        return htmlCode;
    }
    // console.log(htmlCode);
    return null;
}

function priceToHTML(productPrice, number) {
    if(productPrice != null) {
        var htmlCode = '<div id="productPrice' + number + '" class="productsPrice">' + productPrice + '</div> </div>';
        return htmlCode;
    }
    // console.log(htmlCode);
    return null;
}


app.use((req, res, next) => {
    // Choose which IP addresses are allowed to connect.
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization" // Can also be a '*' to allow any header.
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is booming on port 5000
    Visit http://localhost:5000`);
});


app.get('/',(req,res) => {
    console.log('request ', req.url);

    var filePath = '.' + req.url;
    console.log(filePath);
    var extname = String(path.extname(filePath)).toLowerCase();
    console.log(extname);
    var params = url.parse(req.url,true).query;

    if(filePath == './') {
        filePath = __dirname + '/front-end/index.html';
    }
    var extname = String(path.extname(filePath)).toLowerCase();

    var contentType = mimeTypes[extname] || 'application/octet-stream';
    console.log(filePath);
    console.log(mimeTypes[extname], extname);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            console.log('HELLO');
            if(error.code == 'ENOENT') {
                console.log('Hello');
                console.log(error);
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                });
            }
            else {
                console.log('HEllo');
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end();
            }
        }
        else {
            console.log('hello');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});


app.get('/css/style.css',(req,res) => {
    console.log('request ', req.url);

    var filePath = '.' + req.url;
    console.log(filePath);
    var extname = String(path.extname(filePath)).toLowerCase();
    console.log(extname);
    filePath = __dirname + '/front-end/css/style.css';

    var contentType = mimeTypes[extname] || 'application/octet-stream';
    console.log(filePath);
    console.log(mimeTypes[extname], extname);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            console.log('HELLO');
            if(error.code == 'ENOENT') {
                console.log('Hello');
                console.log(error);
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                });
            }
            else {
                console.log('HEllo');
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end();
            }
        }
        else {
            console.log('hello');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});


app.get('/js/scrapeValue.js',(req,res) => {
    console.log('request ', req.url);

    var filePath = '.' + req.url;
    console.log(filePath);
    var extname = String(path.extname(filePath)).toLowerCase();
    console.log(extname);
    filePath = __dirname + '/front-end/js/scrapeValue.js';

    var contentType = mimeTypes[extname] || 'application/octet-stream';
    console.log(filePath);
    console.log(mimeTypes[extname], extname);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            console.log('HELLO');
            if(error.code == 'ENOENT') {
                console.log('Hello');
                console.log(error);
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                });
            }
            else {
                console.log('HEllo');
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end();
            }
        }
        else {
            console.log('hello');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});


app.get('/s',async function(req,res) {
    console.log('Inside search route');
    var params = url.parse(req.url,true).query;
    var searchValue = params.search.replace(new RegExp(' ', 'g'), '+');
    console.log(searchValue + '\n');
    itemsJSON = await fetchItems(searchValue);
    if(itemsJSON === 0) {
        res.writeHead(200, { 'Content-Type': 'text/html'});
        res.end(screwTarget());
    } else {
        console.log('1:', itemsJSON);

        
        var htmlResponse;
        for(var i = 0; i < itemsJSON.search_response.items.Item.length; i++) {
            let item = itemsJSON.search_response.items.Item[i];
            let imageBaseURL = item.images[0].base_url;
            let itemDescription = item.description;

            if(itemDescription != '') {
                let itemPrice = item.price.formatted_current_price;
                let itemImageURL = imageBaseURL + item.images[0].primary;

                if(i == 0) {
                    htmlResponse = imageToHTML(itemImageURL, i + 1);
                    htmlResponse += textToHTML(itemDescription, i + 1);
                    htmlResponse += priceToHTML(itemPrice, i + 1);
                }
                else {
                    htmlResponse += imageToHTML(itemImageURL, i + 1);
                    htmlResponse += textToHTML(itemDescription, i + 1);
                    htmlResponse += priceToHTML(itemPrice, i + 1);
                }
            } else {
                continue;
            }
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlResponse);
    }
});


app.get('/hello',(req,res) => {
    res.send(process.cwd());
});

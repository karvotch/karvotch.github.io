const express = require('express');
const app = express();
var fs = require('fs');
var path = require('path');
const url = require('url');
const cheerio = require('cheerio');
const req = require('request');
const puppeteer = require('puppeteer');

// function searchSite() {
//     var titleText;
//     req({
//         method: 'GET',
//         url: 'https://www.target.com/s?searchTerm=jelly'
//         }, (err, res, body) => {

//             if(err) return console.error(err);

//             let $ = cheerio.load(body);

//             let title = $('title');
//             titleText = title.text();
//             console.log(titleText);

//             console.log('req: ' + title.text());
//         });
//     if(titleText == undefined) {

//     }
//     else {
//         return titleText;
//     }
// }

function textToHTML(productText, number) {
    if(productText != null) {
        var htmlCode = '<div id="productDescription' + number + '" class="productsDescription"> <a id="productLink' + number + '">' + productText + '</a>' + '</div>';
        return htmlCode;
    }
    // console.log(htmlCode);
    return null;
}

function imageToHTML(productImage, number) {
    if(productImage != null) {
        var htmlCode = '<div id="product' + number + '"> <div id="image' + number + '" class="images">' + '<img id="productImage' + number + '" src="' + 'http:' + productImage + '"> <br> </div>';
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
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.get('/',(req,res) => {
    console.log('request ', request.url);

    var filePath = '.' + request.url;
    console.log(filePath);
    var extname = String(path.extname(filePath)).toLowerCase();
    console.log(extname);
    var params = url.parse(request.url,true).query;

    if (filePath == './' || extname == '.js' || extname == '.css') {
        if(filePath == './') {
            filePath = 'W:/WebDev/pages/karvotch.github.io/CSE/server/clothingSearchEngine.html';
        }
        var extname = String(path.extname(filePath)).toLowerCase();
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
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    console.log('HEllo');
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end();
                }
            }
            else {
                console.log('hello');
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }
    else if(params.search) {
    // else {
        var searchValue = params.search.replace(new RegExp(' ', 'g'), '+');
        console.log(searchValue + '\n');

        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          var targetUrl = ('https://www.target.com/s?searchTerm=' + searchValue);
          console.log(targetUrl);

          await page.goto(targetUrl, {waitUntil: 'networkidle0'});
          // await page.goto('https://www.target.com/s?searchTerm=pants', {waitUntil: 'networkidle0'});
          const content = await page.content();

          let $ = cheerio.load(content);
          let title = $('title');
          var titleText = title.text();
          console.log(titleText);
          // console.log(content);

          let list2 = [];
          $('.h-padding-t-tight').children('li').each(function (i, e) {
            // list[i] = $(this).text();
            list2[i] = $(this);
        });

          for (var product of list2) {
            // console.log(product.text() + '\n');
          }

          var htmlResponse;
          for(var i = 0; i < list2.length; i++) {
            var itemDescription = list2[i].children().first().children().last().find('a').first().text();
            // console.log(itemDescription);
            if(itemDescription != '') {
                var itemImage = list2[i].find('.Images__FadePrimaryOnHover-sc-1gcxa3z-0').html();
                var itemImageURL;
                var itemPrice = list2[i].find('.h-text-bs').last().text();
                // var itemImageIndex = itemImage.search(new RegExp('//target.scene7.com/is/image/Target/GUEST_953ed6a1-eed3-4dea-bb97-3cf80be87c29?wid=114', 'g'));
                if(itemImage != null) {
                    // console.log(itemImage + '\n');
                    itemImageURL = itemImage.substring(212, 334);
                }
                    //Check if this step is necessary. Not sure why I placed it.
                else {
                    console.log('No string' + '\n');
                    itemImage = list2[i].find('.Images__ImageContainer-sc-1gcxa3z-2').html();
                    // itemImageURL = itemImage.substring(108, 230);
                    itemImageURL = itemImage.substring(221, 343);
                }
                
                if(itemPrice != null) {
                    console.log(itemPrice);
                }
                else {
                    console.log('No price printed');
                }

                // var itemImageURL = itemImage.substring(212, 334);
                if(itemImageURL != '') {
                    console.log(itemImageURL + '\n');
                }
                else {
                    console.log('No URL' + '\n');
                }

                if(i == 0) {
                    htmlResponse = imageToHTML(itemImageURL, i + 1);
                    htmlResponse += textToHTML(itemDescription, i + 1);
                    // htmlResponse += priceToHTML(itemPrice, i + 1);
                }
                else {
                    htmlResponse += imageToHTML(itemImageURL, i + 1);
                    htmlResponse += textToHTML(itemDescription, i + 1);
                    // htmlResponse += priceToHTML(itemPrice, i + 1);
                }
            }
            else {
                continue;
            }
          }
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(htmlResponse);

          browser.close();
        })();
    }
})



module.exports = app;
var page = require('webpage').create();
page.content = '<html><body><h1>html content here</h1></body></html>';
page.render('message.png');
phantom.exit();



//html: <canvas id="image"></canvas>
/*
var ctx = document.querySelector('canvas').getContext('2d');
ctx.strokeText('Hello', 10, 10);
var image = document.getElementById("image");
var dataUrl = image.toDataURL();
console.log(dataUrl); //logs raw data form of url
*/

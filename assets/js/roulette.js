
////////////////////////////////////////////////////////OUR VARIABLES AND ARRAYS//////////////////////////////////
var options = ["movies", "pizza night", "drive-in", "swapmeet", "mini-golf", "roller skating", "ice cream", "arcades", "amusement park", "karaoke"];
var resultName;
var resultImageURL;
var resultAddressLine1;
var resultAddressLine2;
var resultPhone;
var resultRating;
var resultURL;
var resulttext;
////////////////////////////////////////////////////////ROULETTE CODE//////////////////////////////////
var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var placeholder;
var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 
    
    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index];
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
  ////////////////////////////////////////////////////////OUR CODE//////////////////////////////////////////
  //---------------------------------------------------------------------------------------------VARIABLES
  var city= "riverside"+",";
  var state="ca";
  var area="location=" + city+state;
  var term="term="+ text;
  //---------------------------------------------------------------------------------------------AJAX CALL
  queryURL = "https://yelp-test-beast-coders.herokuapp.com/business/search/" + area + "&" + term;
  var apiKey="OZpDFQVOqnln_GHOPgCydUdo3Ce1IzKxvdzL7qXezxZhjATA2kC3Kw72LE_Vntan_m0mU70rj0KZ0ptxv3vE2wqUMCt2ID_wjXTFF1Tamrd6ASEdFJM5p1v2LCCHXHYx"
    $.ajax({
      url: queryURL,
      dataType: 'json',
      contentType: 'json',
      headers: {
        'Authorization':'Bearer OZpDFQVOqnln_GHOPgCydUdo3Ce1IzKxvdzL7qXezxZhjATA2kC3Kw72LE_Vntan_m0mU70rj0KZ0ptxv3vE2wqUMCt2ID_wjXTFF1Tamrd6ASEdFJM5p1v2LCCHXHYx',
    },
      method: 'GET',
      dataType: 'json',
    })
    .then(function(response){
      displayResults(response);
    }); 
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();
//---------------------------------------------------------------------------------------------DISPLAY RESULTS
function displayResults(results){
  $("#results").empty();
 console.log("YOU ARE IN DISPLAY RESULTS", results);
 resulttext=$("<p>").text("HERE ARE YOUR RESULTS");
    $("#results").append(resulttext);
 for (i=0; i<5; i++){
      resulttext=$("<p>").text("OPTION "+(i+1));
      $("#results").append(resulttext);
    resultName=results.businesses[i].name;
      resulttext=$("<p>").text("Name of the place: "+resultName);
      $("#results").append(resulttext);
    resultImageURL=results.businesses[i].image_url;
      resulttext=$("<img>");
      resulttext.attr("src", resultImageURL);
      resulttext.attr("alt", "image");
      $("#results").append(resulttext);
    resultAddressLine1=results.businesses[i].location.display_address[0];
      resulttext=$("<p>").text("Address: "+resultAddressLine1);
      $("#results").append(resulttext);
    resultAddressLine2=results.businesses[i].location.display_address[1];
      resulttext=$("<p>").text("Address: "+resultAddressLine2);
      $("#results").append(resulttext);
    resultPhone=results.businesses[i].phone;
      resulttext=$("<p>").text("Phone Number: "+resultPhone);
      $("#results").append(resulttext);
    resultRating=results.businesses[i].rating;
      resulttext=$("<p>").text("Rating: "+resultRating+"/5");
      $("#results").append(resulttext);
    resultURL=results.businesses[i].url;
      resulttext=$("<p>").text("Link to their website: "+resultURL);
      $("#results").append(resulttext);
      resulttext=$("<p>").text("");
      $("#results").append(resulttext);
 };
}
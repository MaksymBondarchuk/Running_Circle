/**
 * Created by Max on 2016-01-27.
 */


var wasFirstClick = false;
var wasSecondClick = false;
var x1;
var y1;
var x2;
var y2;
var radius;
var figureColor = 'black';

var smallCircleRadius = 5;
var smallCircleColor = 'red';
var xS = 0;
var yS = 0;
var smallCircleInitialized = false;
var rangeForLook = 5;

function DrawSimpleCircle(event) {
    var canvas = $('#mainCanvas')[0];
    var ctx = canvas.getContext("2d");
    var mousePoint = getMousePos(canvas, event);

    if (!wasFirstClick) {
        x1 = mousePoint.X;
        y1 = mousePoint.Y;
        wasFirstClick = true;
    }
    else if (!wasSecondClick) {
        x2 = mousePoint.X;
        y2 = mousePoint.Y;


        ctx.beginPath();

        radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        ctx.stroke();

        wasSecondClick = true;
    }

}

function DoStuff(event) {
    var canvas = $('#mainCanvas')[0];
    var mousePoint = getMousePos(canvas, event);

    var divColor = document.getElementById("divColor");

    var clr = getPixelColor(mousePoint.X, mousePoint.Y);


    //divColor.style.backgroundColor = getPixelColor(mousePoint.X, mousePoint.Y);
    divColor.style.backgroundColor = clr;
    //alert(clr);

    var divTxt = document.getElementById("divTxt");
    divTxt.innerHTML = clr;
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        X: event.clientX - rect.left,
        Y: event.clientY - rect.top
    };
}


function startSmallCircle() {
    setInterval(smallCircle, 100);
}

function smallCircle() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");

    if (wasSecondClick) {
        if (!smallCircleInitialized) {
            xS = x1;
            yS = y1 + radius;
            smallCircleInitialized = true;
        }
        else
            for (var i = xS - smallCircleRadius - rangeForLook; i <= xS + smallCircleRadius + rangeForLook; i++)
                for (var j = yS - smallCircleRadius - rangeForLook; j <= yS + smallCircleRadius + rangeForLook; j++) {
                    //alert(getPixelColor(i, j));
                    //var cl = getPixelColor(i, j);
                    //var cb = 'black';

                    var clr = getPixelRGBA(i, j);
                    if (clr.R == 0 && clr.G == 0 && clr.B == 0 && clr.A != 0) {
                    //if (getPixelColor(i, j) == 'black') {
                    //if (cl == 'black') {
                        xS = i;
                        yS = j;
                        break;
                    }
                }

        ctx.beginPath();
        ctx.arc(xS, yS, smallCircleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = smallCircleColor;
        ctx.fill();
        //ctx.stroke();
    }
}

function getPixelColor(x, y) {
    var canvas = $('#mainCanvas')[0];
    var ctx = canvas.getContext("2d");
    var clr = ctx.getImageData(x, y, 1, 1).data;
    return "rgba(" + [clr[0], clr[1], clr[2], clr[3]].join(",") + ")";
}

function getPixelRGBA(x, y) {
    var canvas = $('#mainCanvas')[0];
    var ctx = canvas.getContext("2d");
    var clr = ctx.getImageData(x, y, 1, 1).data;
    return {
        R: clr[0],
        G: clr[1],
        B: clr[2],
        A: clr[3]
    };
}
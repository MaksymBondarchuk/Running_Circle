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
var points = [];

var smallCircleRadius = 5;
var smallCircleColor = 'red';
var xS = 0;
var yS = 0;
var smallCircleInitialized = false;
var rangeForLook = 1;


function DrawSimpleCircle(event) {
    var canvas = $('#mainCanvas')[0];
    //var ctx = canvas.getContext("2d");
    var mousePoint = getMousePos(canvas, event);

    if (!wasFirstClick) {
        x1 = mousePoint.X;
        y1 = mousePoint.Y;
        wasFirstClick = true;
    }
    else if (!wasSecondClick) {
        x2 = mousePoint.X;
        y2 = mousePoint.Y;

        //ctx.beginPath();
        radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        //ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        //ctx.stroke();

        points.push({X: x1 - radius, Y: y1 - radius});  // p0
        points.push({X: x1 + radius, Y: y1 - radius});  // p1
        points.push({X: x1 + radius, Y: y1 + radius});  // p2
        points.push({X: x1 - radius, Y: y1 + radius});  // p3

        drawFrame();

        wasSecondClick = true;
    }
    else {
        var distances = [];
        for (i in points)
            distances.push(Math.sqrt(Math.pow(points[i].X - mousePoint.X, 2) + Math.pow(points[i].Y - mousePoint.Y, 2)))

        var imin = 0;
        for (var i = 1; i < distances.length; i++)
            if (distances[i] < distances[imin])
                imin = i;

        var newPoint = {X: mousePoint.X, Y: mousePoint.Y};
        if (imin == 0) {
            if (distances[1] < distances[distances.length - 1])
                points.splice(1, 0, newPoint);
            else
                points.splice(0, 0, newPoint);
        }
        else if (imin == distances.length - 1) {
            if (distances[distances.length - 2] < distances[0])
                points.splice(distances.length - 1, 0, newPoint);
            else
                points.splice(0, 0, newPoint);
        }
        else if (distances[imin - 1] < distances[imin + 1])
            points.splice(imin, 0, newPoint);
        else
            points.splice(imin + 1, 0, newPoint);
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

    var divCoord = document.getElementById("divCoord");
    divCoord.innerHTML = mousePoint.X + "," + mousePoint.Y;
}


function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        X: event.clientX - rect.left,
        Y: event.clientY - rect.top
    };
}


function startSmallCircle() {
    setInterval(smallCircle, 50);
}


function smallCircle() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");

    if (wasSecondClick) {
        var xSPrev = xS;
        var ySPrev = yS;

        if (!smallCircleInitialized) {
            xS = x1;
            yS = y1 + radius;
            smallCircleInitialized = true;
        }
        else
        // Find new location to move
            for (var i = xS - smallCircleRadius - rangeForLook; i <= xS + smallCircleRadius + rangeForLook; i++) {
                var newPointFound = false;
                for (var j = yS - smallCircleRadius - rangeForLook; j <= yS + smallCircleRadius + rangeForLook; j++) {
                    //alert(getPixelColor(i, j));
                    //var cl = getPixelColor(i, j);
                    //var cb = 'black';

                    var clr = getPixelRGBA(i, j);
                    if (clr.R < 255 && clr.G == 0 && clr.B == 0 && clr.A != 0) {
                        //if (getPixelColor(i, j) == 'black') {
                        //if (cl == 'black') {
                        //alert(i + ", " + j);
                        xS = i;
                        yS = j;
                        newPointFound = true;
                        break;
                    }
                }
                if (newPointFound)
                    break;
            }

        clearCanvas();
        drawFrame();
        //ctx.beginPath();
        ////ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        //ctx.stroke();

        ctx.beginPath();
        ctx.arc(xSPrev, ySPrev, smallCircleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = smallCircleColor;
        ctx.fill();
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


function clearCanvas() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
}


function drawFrame() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();

    ctx.moveTo(points[0].X, points[0].Y);
    for (var i = 1; i < points.length; i++)
        ctx.lineTo(points[i].X, points[i].Y);
    ctx.lineTo(points[0].X, points[0].Y);

    ctx.stroke();
}

/**
 * Created by Max on 2016-01-27.
 */


// For frame
var wasFirstClick = false;
var wasSecondClick = false;
var x1;
var y1;
var x2;
var y2;
var radius;
var points = [];

// For small circle
var smallCircleRadius = 5;
var smallCircleColor = 'red';
var xS = 0;
var yS = 0;
var smallCircleInitialized = false;
var rangeForLook = 1;
//var rangeForRelocate = 100;

var offsetBezier = 0.3;


function drawSimpleCircle(event) {
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


function doStuff(event) {
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
    setInterval(smallCircle, 100);
}


function smallCircle() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");
    var divTest = document.getElementById('divTest');

    if (wasSecondClick) {
        var xSPrev = xS;
        var ySPrev = yS;

        if (!smallCircleInitialized) {
            xS = x1;
            yS = y1 + radius;
            smallCircleInitialized = true;
        }
        else {
            // Find new location to move
            for (var i = xS - smallCircleRadius - rangeForLook; i <= xS + smallCircleRadius + rangeForLook; i++) {
                var newPointFound = false;  // For break 2 loops
                for (var j = yS - smallCircleRadius - rangeForLook; j <= yS + smallCircleRadius + rangeForLook; j++) {
                    //alert(getPixelColor(i, j));
                    //var cl = getPixelColor(i, j);
                    //var cb = 'black';

                    var clr = getPixelRGBA(i, j);
                    if (clr.R < 255 && clr.G == 0 && clr.B == 0 && clr.A != 0) {
                        xS = i;
                        yS = j;
                        newPointFound = true;
                        break;
                    }
                }
                if (newPointFound)
                    break;
            }

            if (xS == xSPrev && yS == ySPrev) {
                //alert("I lost");

                var distances = [];
                for (h in points)
                    distances.push(Math.pow(points[h].X - xS, 2) + Math.pow(points[h].Y - yS, 2));

                var imin = 0;
                for (var h = 1; h < distances.length; h++)
                    if (distances[h] < distances[imin])
                        imin = h;

                xS = points[imin].X;
                yS = points[imin].Y;
                //alert("Go to " + xS + ", " + yS);

                //for (var r = smallCircleRadius + rangeForLook + 1; r < rangeForRelocate; r++) {
                //    var frameFound = false;
                //for (var t = 0; t < 2 * Math.PI * r; t++) {
                //    var currX = r * Math.cos(t);
                //    var currY = r * Math.sin(t);
                //    var color = getPixelRGBA(currX, currY);
                //    if (color.R < 255 && color.G == 0 && color.B == 0 && color.A != 0) {
                //        xS = currX;
                //        yS = currY;
                //        alert("Go to " + xS + ", " + yS);
                //        frameFound = true;
                //        break;
                //    }
                //}
                //    if (frameFound)
                //        break;
                //}
            }
        }

        clearCanvas();
        drawFrame();
        drawPoints();

        ctx.beginPath();
        ctx.arc(xSPrev, ySPrev, smallCircleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = smallCircleColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(xS, yS, smallCircleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = smallCircleColor;
        ctx.fill();
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

    for (var i = 0; i < points.length; i++) {
        var x0 = points[i].X;
        var y0 = points[i].Y;
        var x1 = points[(i + 1) % points.length].X;
        var y1 = points[(i + 1) % points.length].Y;
        var x2 = points[((i + 1) % points.length + 1) % points.length].X;
        var y2 = points[((i + 1) % points.length + 1) % points.length].Y;

        var dx1 = x1 - x0;
        var dy1 = y1 - y0;
        var dx2 = x2 - x1;
        var dy2 = y2 - y1;

        ctx.moveTo(x0 + dx1 * offsetBezier, y0 + dy1 * offsetBezier);
        ctx.lineTo(x1 - dx1 * offsetBezier, y1 - dy1 * offsetBezier);
        ctx.bezierCurveTo(x1, y1, x1, y1, x1 + dx2 * offsetBezier, y1 + dy2 * offsetBezier);
    }

    //for (var i = 0; i < points.length; i += 2) {
    //    var x0 = points[i].X;
    //    var y0 = points[i].Y;
    //    var x1 = points[(i + 1) % points.length].X;
    //    var y1 = points[(i + 1) % points.length].Y;
    //    var x2 = points[((i + 1) % points.length + 1) % points.length].X;
    //    var y2 = points[((i + 1) % points.length + 1) % points.length].Y;
    //    var x3 = points[((i + 1) % points.length + 2) % points.length].X;
    //    var y3 = points[((i + 1) % points.length + 2) % points.length].Y;
    //
    //    var dx1 = x1 - x0;
    //    var dy1 = y1 - y0;
    //    var dx2 = x3 - x2;
    //    var dy2 = y3 - y2;
    //
    //    ctx.moveTo(x0 - dx1 * offsetBezier, y0 - dy1 * offsetBezier);
    //    ctx.lineTo(x1 + dx1 * offsetBezier, y1 + dy1 * offsetBezier);
    //    //ctx.lineTo(x1 - dx1 * offsetBezier, y1 - dy1 * offsetBezier);
    //    ctx.bezierCurveTo(x1 + dx1 * .5, y1 + dy1 * .5,
    //        x2 - dx2 * .5, y2 - dy2 * .5,
    //        x2 - dx2 * offsetBezier, y2 - dy2 * offsetBezier);
    //    //ctx.lineTo(x3 + dx2 *offsetBezier, y3 + dy2 * offsetBezier);
    //}

    ctx.stroke();
}


function drawPoints() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");

    for (var i in points) {
        ctx.beginPath();
        ctx.arc(points[i].X, points[i].Y, smallCircleRadius * .5, 0, 2 * Math.PI);
        ctx.fillStyle = 'grey';
        ctx.fill();
    }
}

//// Checks is specified color a frame color
//function isFrameColor(color) {
//    return color.R < 255 && color.G == 0 && color.B == 0 && color.A != 0;
//}
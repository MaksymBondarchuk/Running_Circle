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
var smallCircleRadius = 7;
var smallCircleColor = 'red';
var xS = 0;
var yS = 0;
var smallCircleInitialized = false;
var rangeForLook = 3;
//var rangeForRelocate = 100;

var offsetBezier = 0.1;

//class Polygon {
//    constructor(height, width) {
//        this.height = height;
//        this.width = width;
//    }
//}



// Click handler
function drawSimpleCircle(event) {
    var canvas = $('#mainCanvas')[0];
    //var ctx = canvas.getContext("2d");
    var mousePoint = getMousePos(canvas, event);

    if (!wasFirstClick) {
        // Fix center
        x1 = mousePoint.X;
        y1 = mousePoint.Y;
        wasFirstClick = true;
    }
    else if (!wasSecondClick) {
        // Get circle
        x2 = mousePoint.X;
        y2 = mousePoint.Y;

        //ctx.beginPath();
        radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        //ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        //ctx.stroke();

        // Save it as points of a square
        points.push({X: x1 - radius, Y: y1 - radius});  // p0
        points.push({X: x1 + radius, Y: y1 - radius});  // p1
        points.push({X: x1 + radius, Y: y1 + radius});  // p2
        points.push({X: x1 - radius, Y: y1 + radius});  // p3

        drawFrame();

        wasSecondClick = true;
    }
    else {
        // Just add new point
        var distances = [];
        for (i in points)
            distances.push(Math.sqrt(Math.pow(points[i].X - mousePoint.X, 2) + Math.pow(points[i].Y - mousePoint.Y, 2)));

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


// For testing
function testFunction(event) {
    var canvas = $('#mainCanvas')[0];
    var mousePoint = getMousePos(canvas, event);

    var divColor = document.getElementById("divColor");
    var clr = getPixelColor(mousePoint.X, mousePoint.Y);

    // Show all needed information
    divColor.style.backgroundColor = clr;

    var divTxt = document.getElementById("divTxt");
    divTxt.innerHTML = clr;

    var divCoord = document.getElementById("divCoord");
    divCoord.innerHTML = mousePoint.X + "," + mousePoint.Y;
}


// Returns mouse position on the canvas
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        X: event.clientX - rect.left,
        Y: event.clientY - rect.top
    };
}


// Starts small circle "thread"
function startSmallCircle() {
    setInterval(smallCircle, 100);
}


// Redraws the whole canvas
function smallCircle() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");
    var divTest = document.getElementById('divTest');

    // Draw small circle only if user selected initial frame
    if (wasSecondClick) {
        var xSPrev = xS;
        var ySPrev = yS;

        // If function is called for the first time
        if (!smallCircleInitialized) {
            xS = x1 + radius;
            yS = y1 + radius;
            smallCircleInitialized = true;
        }
        else {
            // Find new location to move
            for (var i = xS - smallCircleRadius - rangeForLook; i <= xS + smallCircleRadius + rangeForLook; i++) {
                var newPointFound = false;  // For break 2 loops
                for (var j = yS - smallCircleRadius - rangeForLook; j <= yS + smallCircleRadius + rangeForLook; j++) {
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

                // Go to the nearest point
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

        // Redraw everything
        clearCanvas();
        drawPoints();
        drawFrame();

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


// Returns pixel's color as a string
function getPixelColor(x, y) {
    var canvas = $('#mainCanvas')[0];
    var ctx = canvas.getContext("2d");
    var clr = ctx.getImageData(x, y, 1, 1).data;
    return "rgba(" + [clr[0], clr[1], clr[2], clr[3]].join(",") + ")";
}


// Returns pixel's color as a struct
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


// Clears canvas
function clearCanvas() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
}


// Draws frame for small circle to move
function drawFrame() {
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();

    //for (var i = 0; i < points.length; i++) {
    //    var x0 = points[i].X;
    //    var y0 = points[i].Y;
    //    var x1 = points[(i + 1) % points.length].X;
    //    var y1 = points[(i + 1) % points.length].Y;
    //    var x2 = points[((i + 1) % points.length + 1) % points.length].X;
    //    var y2 = points[((i + 1) % points.length + 1) % points.length].Y;
    //
    //    var dx1 = x1 - x0;
    //    var dy1 = y1 - y0;
    //    var dx2 = x2 - x1;
    //    var dy2 = y2 - y1;
    //
    //    ctx.moveTo(x0 + dx1 * offsetBezier, y0 + dy1 * offsetBezier);
    //    ctx.lineTo(x1 - dx1 * offsetBezier, y1 - dy1 * offsetBezier);
    //    ctx.bezierCurveTo(x1, y1, x1, y1, x1 + dx2 * offsetBezier, y1 + dy2 * offsetBezier);
    //}

    // Get all deltas
    var deltas = [];
    for (var _i = 0; _i < points.length; _i++) {
        var _x0 = points[_i != 0 ? _i - 1 : points.length - 1].X;
        var _y0 = points[_i != 0 ? _i - 1 : points.length - 1].Y;
        var _x1 = points[_i].X;
        var _y1 = points[_i].Y;
        var _x2 = points[(_i + 1) % points.length].X;
        var _y2 = points[(_i + 1) % points.length].Y;

        var r0 = Math.sqrt(Math.pow(_x1 - _x0, 2) + Math.pow(_y1 - _y0, 2));
        var r2 = Math.sqrt(Math.pow(_x1 - _x2, 2) + Math.pow(_y1 - _y2, 2));
        deltas.push({X: _x2 - _x0, Y: _y2 - _y0, R2: r2, R0: r0});
    }

    // Draw frame
    for (var i = 0; i < points.length; i++) {
        //var x0 = points[i != 0 ? i - 1 : points.length - 1].X;
        //var y0 = points[i != 0 ? i - 1 : points.length - 1].Y;
        var x1 = points[i].X;
        var y1 = points[i].Y;
        var idxP1 = (i + 1) % points.length;    // index plus 1
        var x2 = points[idxP1].X;
        var y2 = points[idxP1].Y;

        //alert("dx = " + deltas[i].X + ", dy = " + deltas[i].Y);

        // Page 3
        var offset0 = deltas[i].R0 / (deltas[i].R0 + deltas[i].R2);
        var offset2 = deltas[i].R2 / (deltas[i].R0 + deltas[i].R2);
        var offset20 = deltas[idxP1].R0 / (deltas[idxP1].R0 + deltas[idxP1].R2);

        ctx.moveTo(x1 - deltas[i].X * offsetBezier * offset0, y1 - deltas[i].Y * offsetBezier * offset0);
        ctx.lineTo(x1 + deltas[i].X * offsetBezier * offset2, y1 + deltas[i].Y * offsetBezier * offset2);
        ctx.bezierCurveTo(x1 + deltas[i].X * .5 * offset2, y1 + deltas[i].Y * .5 * offset2,
            x2 - deltas[idxP1].X * .5 * offset20, y2 - deltas[idxP1].Y * .5 * offset20,
            x2 - deltas[idxP1].X * offsetBezier * offset20, y2 - deltas[idxP1].Y * offsetBezier * offset20);
    }

    ctx.stroke();
}


// Draws user's points
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
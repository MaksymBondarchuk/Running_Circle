/**
 * Created by Max on 2016-01-27.
 */


var haveFirstPoint = false;
var x1;
var y1;
var x2;
var y2;


function DrawSimpleCircle(event) {
    var canvas = document.getElementById("mainCanvas");
    var mousePoint = getMousePos(canvas, event);

    if (!haveFirstPoint) {
        x1 = mousePoint.X;
        y1 = mousePoint.Y;
        haveFirstPoint = true;
    }
    else {
        x2 = mousePoint.X;
        y2 = mousePoint.Y;

        var ctx = canvas.getContext("2d");
        ctx.beginPath();

        var radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        X: event.clientX - rect.left,
        Y: event.clientY - rect.top
    };
}

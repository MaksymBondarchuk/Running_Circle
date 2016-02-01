# Running_Circle
First of all user clicks on some point of canvas. It is a center of a circle.

Then user clicks one more and from that two points big circle is drawn.

Then small red circle (actually 2 small circles) begins to run on big one.

When user clicks on some point, path for smalll circle changes that it doesn't contain any angles and goes through new point.
New point is inserted on place where distances to the two neighbours are the shortest.

Canvas redraws after some time interval all the time. Path for small circle (or frame) is drawed by next steps:
1. For each point find line that connects two adjacent points and how our point divides this line.
2. For each point:
  a. Draw parallel line through our point with length of origin multiplied on some coeficient
  b. Draw cubic (square) Bezier curve to the same line of next point.
  
Small red circle finds where to relocate every time. It analyses adjacent pixels for black color. If it finds some it relocates there.
Otherwise it relocates to nearest point (which was clicked by user).

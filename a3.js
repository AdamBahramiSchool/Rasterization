import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  Rasterizer.prototype.drawLine = function(v1, v2) {
    let [x1, y1, [r1, g1, b1]] = v1;
    let [x2, y2, [r2, g2, b2]] = v2;
  
    // Calculate deltas
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
  
    // Linear interpolation setup
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    while (true) {
      // Linear interpolation for color
      const distanceCovered = Math.sqrt((x1 - v1[0]) ** 2 + (y1 - v1[1]) ** 2);
      const colorFraction = distanceCovered / distance;
      const interpolatedColors = [
        r1 + colorFraction * (r2 - r1),
        g1 + colorFraction * (g2 - g1),
        b1 + colorFraction * (b2 - b1)
      ];
  
      this.setPixel(x1,y1, interpolatedColors);
  
      if (x1 === x2 && y1 === y2) break;
  
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  
// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;

  // Determine bounding box of the triangle
  const xValues = [v1[0], v2[0], v3[0]];
  const yValues = [v1[1], v2[1], v3[1]];
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Iterate over pixels in the bounding box
  for (let pixelX = xMin; pixelX <= xMax; pixelX++) {
    for (let pixelY =yMin; pixelY <= yMax; pixelY++) {    
      //call vertices in counter-clockwise fashion
      let condition1 = pointIsInsideTriangle(v1, v2, v3, [pixelX, pixelY]);
      let condition2 = pointIsInsideTriangle(v3, v1, v2, [pixelX, pixelY]);
      let condition3 = pointIsInsideTriangle(v2, v3, v1, [pixelX, pixelY]);

      // Check if the pixel is inside the triangle and resulting condition is true
      if (condition1 && condition2 && condition3) {
        const barycentric = calculateBarycentricCoordinates(v1, v2, v3, [pixelX, pixelY]);
        const interpolatedColors = [
            r1 * barycentric[0] + r2 * barycentric[1] + r3 * barycentric[2],
            g1 * barycentric[0] + g2 * barycentric[1] + g3 * barycentric[2],
            b1 * barycentric[0] + b2 * barycentric[1] + b3 * barycentric[2],
        ];
    
        this.setPixel(pixelX,pixelY, interpolatedColors);
    }
    }
  }
};

// Helper function to calculate barycentric coordinates
function calculateBarycentricCoordinates(v1, v2, v3, p) {
  const v1c = [1.0, 0.0, 0.0];
  const v2c = [0.0, 1.0, 0.0];
  const v3c = [0.0, 0.0, 1.0];
  const a0 = Math.abs(((v2[0] - p[0]) * (v3[1] - p[1])) - (v2[1] - p[1]) * (v3[0] - p[0]))/2;
  const a1 = Math.abs(((v3[0] - p[0]) * (v1[1] - p[1])) - (v3[1] - p[1]) * (v1[0] - p[0]))/2;
  const a2 = Math.abs(((v1[0] - p[0]) * (v2[1] - p[1])) - (v1[1] - p[1]) * (v2[0] - p[0]))/2;
  const A = a0 + a1 + a2;
  const u = a0 / A;
  const v = a1 / A;
  const w = a2 / A;
  const pointColor = [
    u * v1c[0] + v * v2c[0] + w * v3c[0],
    u * v1c[1] + v * v2c[1] + w * v3c[1],
    u * v1c[2] + v * v2c[2] + w * v3c[2]
  ];
  return pointColor;
}




function pointIsInsideTriangle(v1,v2,topedgepoint,p){
  
    const x1 = v1[0];
    const y1 = v1[1];
    const x2 = v2[0];
    const y2 = v2[1];
    const checkEdge = [x2 - x1, y2 - y1];
    const topedgeCase = topedgepoint[1];
    const pointX = p[0];
    const pointY = p[1];
    let conditionL1 = false;
    let a = y2 - y1;
    let b = x1 - x2;
    let c = x2 * y1 - x1 * y2;
    
    if ((a * pointX) + (b * pointY) + c > 0) {
      conditionL1 = true;
    } 
    //top edge and left edge case
    else if ((a * pointX) + (b * pointY) + c === 0) {
      if (checkEdge[0] < 0 || checkEdge[1] < 0) {
        conditionL1 = true;
      }
    }
    
  return conditionL1;

}


////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [ 
  // "v,10,10,1.0,0.0,0.0;", 
  // "v,52,52,0.0,1.0,0.0;", 
  // "v,52,10,0.0,0.0,1.0;", 
  // "v,10,52,1.0,1.0,1.0;", 
  // "t,0,1,2;",
  // "t,0,3,1;",
  // "v,10,10,1.0,1.0,1.0;",
  // "v,10,52,0.0,0.0,0.0;",
  // "v,52,52,1.0,1.0,1.0;",
  // "v,52,10,0.0,0.0,0.0;",
  // "l,4,5;",
  // "l,5,6;",
  // "l,6,7;",
  // "l,7,4;"

  //Happy face with colored eyebrows
"v,10,10,1.0,0.0,0.0;",
"v,52,52,0.0,1.0,0.0;",
"v,52,10,0.0,0.0,1.0;",
"v,10,52,1.0,1.0,1.0;",
"l,0,2;",
"l,2,1;",
"l,1,3;",
"l,3,0;",
"v,18,20,0,1,0;",
"v,26,20,0,0,1;",
"l,4,5;",
"v,36,20,0,1,0;",
"v,44,20,0,0,1;",
"l,6,7;",

"v,18,28;",
"l,4,8;",
"v,26,28;",
"l,5,9;",
"l,8,9;",

"v,36,28;",
"v,44,28;",
"l,6,10;",
"l,7,11;",
"l,10,11;",

"v,26,40;",
"v,36,40;",
"l,12,13;",

"v,26,35;",
"l,12,14;",

"v,18,35;",
"l,14,15;",

"v,18,45;",
"l,15,16;",

"v,44,45;",
"l,16,17;",

"v,44,35;",
"l,17,18;",

"v,36,35;",
"l,18,19;",

"l,19,13;",

"t,4,5,0;",

"t,6,7,2;",


].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };

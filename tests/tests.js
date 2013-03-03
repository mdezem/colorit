
var colorit = require("../lib/colorit");

function test(str) {
    //console.log("Original: ", str);
    console.log("Colored: ", colorit(str));
}

var allColors = [];
for (p in colorit.colors) {
    if (colorit.colors.hasOwnProperty(p))
        allColors.push("<<", p, ">>", p, ', ');
}

test(allColors.join(''));

test("<<w;b>>text is white, blackground is blue<<;g>>now the background is green");
test("<<white;blue>>text is white, blackground is blue, <<;green>>now the background is green");
test("<<w;b>>text is white, blackground is blue<<;g>>now the background is green <<white;blue>>text is white, blackground is blue, <<;yellow>>now the background is yellow.  <</>> this clears the last modification, and this <<*>> clear all.<</>>rollback the clean all");


var str = colorit("<<;r>>Hello<<k;y>> World<<;w>>!");
console.log(str);

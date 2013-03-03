
var console = require("console");

function buildColors() {
    // ansi colors
    var colorNames = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
    var shortColors = ["k", "r", "g", "y", "b", "m", "c", "w"];

    //build color dictionary
    var colors = {};
    for (var i = 0; i < colorNames.length; i++) {
        colors[colorNames[i]] = colors[shortColors[i]] = {
            fg: '\x1B[' + (30 + i) + 'm',
            bg: '\x1B[' + (40 + i) + 'm'
        };
    }
    return colors;
}

var resetCode = '\x1B[0m\x1B[39m',
    colors = buildColors(),
    tag = /<<(\/|\*)>>|<<([a-z]+)?;?([a-z]+)?>>/;

function parse(str) {
    var result = [],
        stack = [],
        match,
        stackEntry;

    function emit(data) {
        if (data.fg) result.push(data.fg);
        if (data.bg) result.push(data.bg);
    };

    function resolveColor(propName, clr) {
        // we will not get a color code from the statement above if:
        // 1. the user does not specify a color
        // 2. the user specifies a color data does not exists
        // In the second case the user provided color is ignored (fails silently).
        // We don't want to break the application just because a color is mispelled.
        var clrCode = clr && colors[clr] && colors[clr][propName];
        
        //try to get from the previus stack entry
        clrCode = clrCode || stack.length && stack[stack.length - 1][propName];

        return clrCode;
    };


    while (match = tag.exec(str)) {
        // match[1] - flags
        // match[2] - foreground
        // match[3] - background
        if (match.index > 0)
            result.push(str.substring(0, match.index));

        str = str.substring(match.index + match[0].length);

        if (match[1]) {
            //
            // check flags
            //
            switch (match[1]) {
                case '/':
                    // discard the current colors
                    if (stack.length)
                        stack.pop();
                    
                    if (stack.length) 
                        emit(stack[stack.length - 1]);
                    else
                        result.push(resetCode);

                    continue;
                case '*':
                    // clear all
                    stackEntry = { fg: resetCode };
                    stack.push(stackEntry);
                    emit(stackEntry);

                    continue;
                default:
                    //flag not reconized, just emit the original value.
                    result.push(match[0]);
                    continue;
            }
        }

        stackEntry = {
            fg: resolveColor('fg', match[2]),
            bg: resolveColor('bg', match[3])
        };

        stack.push(stackEntry);
        emit(stackEntry);
    }

    if (str.length)
        result.push(str);

    result.push(resetCode);

    return result.join('');
}

module.exports = function(str) {
    return parse(str);
};

module.exports.colors = colors;

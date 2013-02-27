/**
 * @fileoverview This generate test page for jquery-ie-text-shadow.
 *     It runs on node-js.
 *     Usage:
 *     $ node test.js
 *     MIT (http://www.opensource.org/licenses/mit-license.php) licensed.
 * @author Ryosuke Otsuya
 */

var fs = require('fs');

var positions = ['0 10px', '-10px 0px'];

var blurs = ['', '0', '0px', '10px'];

var shapes = [];
for (var i in blurs) {
    var blur = blurs[i];
    for (var j in positions) {
        var position = positions[j];
        shapes.push(position + ' ' + blur);
    }
}

var colors = [
    '#DB7093', '#20b2aa',
    'PaleVioletRed', 'LightSeaGreen',
    'rgb(219, 112, 147)',
    'rgba(32,178,170,0)', 'rgba(32,178,170,0.5)', 'rgba(32, 178, 170, 1)'
];

var styles = [];
for (var i in colors) {
    var color = colors[i];
    for (var j in shapes) {
        var shape = shapes[j];
        styles.push(color + ' ' + shape);
        styles.push(shape + ' ' + color);
    }
}

var tags = ['div', 'span'];

var html = '';

html
    += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"\n'
    + '"http://www.w3.org/TR/html4/loose.dtd">\n'
    + '<html>\n'
    + '<head>\n'
    + '<meta charset="UTF-8" />\n'
    + '<title>jquery-ie-text-shadow test</title>\n'
    + '<style type="text/css">\n'
    + 'body {\n'
    + 'background-color: #DDDDDD;\n'
    + 'font-size: 24px;\n'
    + 'font-weight: bold;\n'
    + 'font-family: serif;\n'
    + 'line-height: 2;\n'
    + '}\n'
    + '</style>\n'
    + '<script type="text/javascript" src="../jquery-1.8.3.min.js"></script>\n'
    + '<!--[if lt IE 10]>\n'
    + '<script type="text/javascript" src="../jquery-ie-text-shadow.js"></script>\n'
    + '<![endif]-->\n'
    + '</head>\n'
    + '<body>\n';

for (var i in styles) {
    var style = styles[i];
    for (var j in tags) {
        var tag = tags[j];
        html += '<' + tag + ' class="text-shadow" style="text-shadow: ' + style + '">'
            + '&lt;' + tag + '&gt;' + style
            + '</' + tag + '>\n';
    }
}

var length = styles.length;
for (var i in styles) {
    var style = styles[i];
    var style2 = styles[length - 1 - i];
    for (var j in tags) {
        var tag = tags[j];
        html += '<' + tag + ' class="text-shadow" style="text-shadow: ' + style + ', ' + style2 + '">'
            + '&lt;' + tag + '&gt;' + style + ', ' + style2
            + '</' + tag + '>\n';
    }
}

html
    += '<script type="text/javascript">\n'
    + '$(document).ready(function() {\n'
    + '$(\'.text-shadow\').ieTextShadow();\n'
    + '});\n'
    + '</script>\n'
    + '</body>\n'
    + '</html>\n';

fs.writeFile('test.html', html, function(err) {
    if (err) {
        throw err;
    }
    console.log('saved.');
});
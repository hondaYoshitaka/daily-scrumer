var fs = require('fs');

var moduleDir = __dirname + '/../node_modules';
var string = '';
string += '"dependencies":{';
string += "\r\n";
fs.readdirSync(moduleDir).forEach(function (dir) {
    var name = dir;
    var file = [moduleDir, dir, 'package.json'].join('/');
    if (!fs.existsSync(file)) return;
    var content = fs.readFileSync(file, 'utf-8');
    if (content) {
        var json = JSON.parse(content);
        string += "\t";
        string += ['"', name, '"', ':', '"', json.version, '",'].join('');
        string += "\r\n";
    }
});
string = string.replace(/,\r\n$/ ,"\r\n");
string += "}";
console.log(string);

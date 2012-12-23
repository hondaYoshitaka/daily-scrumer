var db = require('../../db'),
    Sprint = db.models['Sprint'];

exports.sprint01 = new Sprint({
    name:'someday, somebody',
    number:124
});
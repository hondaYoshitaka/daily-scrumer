/*
 * チームの初期データ
 */
var models = require('../../models'),
    Team = models['Team'];

exports = module.exports = [
    new Team({
        name:'sample_team',
        members:[
            {name:'sample member01'},
            {name:'sample member02'},
            {name:'sample member03'},
            {name:'sample member04'},
            {name:'sample member04'},
            {name:'sample member05'},
            {name:'sample member06'},
            {name:'sample member07'},
            {name:'sample member08'}
        ]
    })
];
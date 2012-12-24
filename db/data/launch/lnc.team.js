/*
 * チームの初期データ
 */
var models = require('../../models'),
    Team = models['Team'];

exports = module.exports = [
    new Team({
        name:'sample_team',
        members:[
            {name:'sample_team_member01'},
            {name:'sample_team_member02'},
            {name:'sample_team_member03'},
            {name:'sample_team_member04'},
            {name:'sample_team_member04'},
            {name:'sample_team_member05'},
            {name:'sample_team_member06'},
            {name:'sample_team_member07'},
            {name:'sample_team_member08'}
        ]
    })
];
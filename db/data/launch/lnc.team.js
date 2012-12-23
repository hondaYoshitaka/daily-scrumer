/*
 * チームの初期データ
 */
var models = require('../../models'),
    Team = models['Team'];

exports = module.exports = [
    new Team({
        name:'sample_team',
        members:[
            'sample_team_member01',
            'sample_team_member02',
            'sample_team_member03',
            'sample_team_member04',
            'sample_team_member04',
            'sample_team_member05',
            'sample_team_member06',
            'sample_team_member07',
            'sample_team_member08'
        ]
    })
];
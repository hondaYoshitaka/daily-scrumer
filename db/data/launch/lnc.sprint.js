/*
 *  スプリントの初期データ
 */

var models = require('../../models'),
    Sprint = models['Sprint'];

exports = module.exports = [
    new Sprint({
        name:'sample_team_first_sprint',
        number:'1',
        team_name:'sample_team',
        keep_in_mind_0:'be ambitious'
    }),
    new Sprint({
        name:'sample_team_second_sprint',
        number:'2',
        team_name:'sample_team',
        keep_in_mind_0:'any time any where'
    })

];
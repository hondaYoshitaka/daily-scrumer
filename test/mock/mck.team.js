var db = require('../../db'),
    Team = db.models['Team'];

exports.team01 = new Team({
    name:'MyTeam01',
    members:[
        {name:'John'},
        {name:'Mike'},
        {name:'Tom'},
        {name:'Susan'},
        {name:'Maika'},
        {name:'Mary'}
    ]
});
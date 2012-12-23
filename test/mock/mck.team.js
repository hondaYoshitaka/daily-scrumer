var db = require('../../db'),
    Team = db.models['Team'];

exports.team01 = new Team({
    name:'MyTeam01',
    members:[
        'John',
        'Mike',
        'Tom',
        'Susan',
        'Maika',
        'Mary'
    ]
});
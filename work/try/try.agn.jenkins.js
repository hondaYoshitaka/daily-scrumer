var Agent = require('../../agent')['Jenkins'];

//new Agent().getWhether('https://builds.apache.org/', function(success, data){
//    console.log(success, data);
//});

var agent = new Agent();
agent.login(null, function (success, data) {
    console.log('login', success, data);
    agent.getViews(function (success, data) {
        console.log('get views', success, data);
    });
});

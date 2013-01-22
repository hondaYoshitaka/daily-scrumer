var Agent = require('../../agent')['Jenkins'];

//new Agent().getWhether('https://builds.apache.org/', function(success, data){
//    console.log(success, data);
//});

new Agent().login(null, function (success, data) {
    console.log('login', success, data);
});

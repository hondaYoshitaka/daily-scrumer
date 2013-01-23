var JenkinsAgent = require('../agent/agn.jenkins');

function failJson(res) {
    res.json({
        success:false
    });
}
exports.get_whether = function (req, res) {
    var agent = new JenkinsAgent();
    agent.login(function (success) {
        if (!success) {
            failJson(res);
            return;
        }
        var conf = JenkinsAgent['conf'];
        var reqCount = 0, abort = false;
        var result = [];
        conf.url.views.forEach(function (view) {
            reqCount++;
            agent.getWhether(view, function (success, data) {
                reqCount--;
                if (abort) return;
                if (!success) {
                    failJson(res);
                    abort = true;
                    return;
                }
                result = result.concat(data);
                if(reqCount === 0){
                    while(result.length > 20){
                        result.pop();
                    }
                    res.json({
                        success:true,
                        whether:result
                    });
                }
            });
        });
    });
};
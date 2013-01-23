var JenkinsAgent = require('../agent/agn.jenkins');

function failJson(res) {
    res.render({
        success:false
    });
};
exports.get_whether = function (req, res) {
    var agent = new JenkinsAgent();
    agent.login(function (success) {
        if (!success) {
            failJson(res);
            return;
        }
        failJson(res);
        var conf = JenkinsAgent['conf'];
        var reqCount = 0, abort = false;
        var result = [];
        conf.url.views.forEach(function (view) {
            agent.getWhether(view, function (success, data) {
                reqCount--;
                if (abort) return;
                if (!success) {
                    failJson(res);
                    abort = true;
                    return;
                }
                res.json(result);
            });
        });
    });
};
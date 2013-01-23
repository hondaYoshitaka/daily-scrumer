var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util');

function failJson(res) {
    res.json({
        success:false
    });
}
exports = module.exports = function (req, res) {
    var url = RedmineAgent.conf.url.procedure;
    if (!url) {
        failJson(res);
        return;
    }
    RedmineAgent.admin.getWiki(url, function (success, data) {
        if (!success) {
            failJson(res);
            return;
        }
        res.json({
            success:true,
            html:data
        });
    });
};
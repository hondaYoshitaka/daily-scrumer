exports.admin = {
    username:'admin',
    password:'admin'
};

exports.url = (function () {
    var url = {};
    var base = url.base = "http://techbakery.net/redmine";
    url.login = base + "/login";
    url.logout = base + '/logout';
    return url;
})();

var dir = [__dirname, "../work/styledocco"].join('/');

exports.command = (function(){
    var cd = ["cd", dir].join(' '),
        sh = ["sh", "run.styledocco.sh"].join(' ');
    return [cd, sh].join(' && ');
})();

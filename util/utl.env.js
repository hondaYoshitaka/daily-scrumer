/*
 * env判定用のutil
 */


/* developmentモードかどうか */
exports.isDevelopment = function(){
    if(!process.env.NODE_ENV) return true; //デフォルトはdevelopment
    return process.env.NODE_ENV === 'development';
};

/* productionモードかどうか */
exports.isProduction = function(){
    return process.env.NODE_ENV === 'production';
};



/* testモードかどうか */
exports.isTest = function(){
    return process.env.NODE_ENV === 'test';
};

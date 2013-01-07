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


exports.enumerations = (function () {

})();


exports.issue_statuses = [
    { id:'1', name:'新規', closed:false },
    { id:'2', name:'進行中', closed:false },
    { id:'3', name:'解決', closed:false },
    { id:'4', name:'フィードバック', closed:false },
    { id:'5', name:'終了', closed:true },
    { id:'6', name:'却下', closed:true },
    { id:'7', name:'修正済', closed:false }
];

exports.trackers = [
    { id:'3', name:'サポート' },
    { id:'1', name:'バグ' },
    { id:'2', name:'機能' }
];

exports.issue_priorities = { '3':{ id:'3', name:'低め', isDefault:false, active:true },
    '4':{ id:'4', name:'通常', isDefault:true, active:true },
    '5':{ id:'5', name:'高め', isDefault:false, active:true },
    '6':{ id:'6', name:'急いで', isDefault:false, active:true },
    '7':{ id:'7', name:'今すぐ', isDefault:false, active:true }
};


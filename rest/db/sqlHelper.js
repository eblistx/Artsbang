var moment = require('moment');

exports.tableDefine = function(config){
    var table = {};
    table.name = config.name;
    for(var i=0; i<config.columns.length; i++){
        table[config.columns[i]] = config.columns[i];
    }
    return table;
}

exports.dateFormat = function(date){
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
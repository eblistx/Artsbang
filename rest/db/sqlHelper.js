exports.tableDefine = function(config){
    var table = {};
    table.name = config.name;
    for(var i=0; i<config.columns.length; i++){
        table[config.columns[i]] = config.columns[i];
    }
    return table;
}
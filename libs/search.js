var Icon = require('../models/icon.js');

function search(q, cb) {
    // todo: validate param q
    if (q === "") typeof cb === 'function' && cb([]);
    var qReg = new RegExp(q, 'i');
    Icon.find({
            name: {"$regex": qReg}
        })
        .exec(function(err, docs) {
            if (err) {
                console.error(err);
                return;
            }
            docs.forEach(function(icon) {
                icon.content = tools.generateHtmlIconContent(icon.iconId);
            }); 
            typeof cb === 'function' && cb(docs);
        });
}

module.exports = {
    search: search
};

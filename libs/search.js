var Icon = require('../models/icon.js');

function search(q, cb) {
    // todo: validate param q
    if (toString.apply(q) !== "[object String]" || q === "")
        typeof cb === 'function' && cb([]);
    Icon.$where('this.name.search("' + q + '") !== -1')
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

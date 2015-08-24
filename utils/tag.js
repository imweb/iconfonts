/*
* @author helondeng
* tag database operation.
 */

var Tag = require('../models/tag');

/*
* add tag
 */
function add(obj, cb) {
    var tag = new Tag({
        iconName: obj.iconName,
        iconId: obj.iconId,
        tag: obj.tag
    });

    tag.save(function() {
        typeof cb === 'function' && cb(tag);
    });
}

/*
* delete tag
 */
function remove(tagId, cb) {
    var tag = Tag.find({
        tagId: tagId
    });

    tag.remove(cb);
}

/*
* find add tags By iconId
 */

function findAllTagsByIconId(iconId, cb) {
    Tag.find({
        iconId: iconId
    }).exec(function(err, tags) {
        typeof cb === 'function' && cb(err, tags);
    });
}


module.exports = {
    add: add,
    remove: remove,
    findAllTagsByIconId: findAllTagsByIconId
};
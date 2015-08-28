/*
 * insert business
 */
var B = require('./business');

var b = new B({
    name: 'H5 公众帐号',
    pm: 'lqlong'
});

b.save(function(err) {
    if (err) {
        console.log(err);
    }
});

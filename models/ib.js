
/*
* insert business
 */
var B = require('./business');

var b = new B({
    name: '上课web化',
    pm: 'ouvenzhang'
});

 b.save(function (err, bid) {
    if(err) {
        console.log(err);
    }
});

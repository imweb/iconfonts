var mongoose = require('mongoose');

var IconSchema = mongoose.Schema({
    iconId: Number,
    name: String,
    content: String,
    kind: String, // three kinds: h5, pc, other
    path: String
});

// create Schema methods
// IconSchema.methods.methodname = fn() {}

var Icon = mongoose.model('Icon', IconSchema);

module.exports = Icon;

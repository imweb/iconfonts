var mongoose = require('mongoose');

var IconSchema = mongoose.Schema({
    iconId: Number,
    name: String,
    content: String,
    kind: String, // three kinds: h5, pc, other
    svgPath: String
});

// create Schema methods
// IconSchema.methods.methodname = fn() {}

var Icon = mongoose.Model('icon', iconSchema);

module.exports = Icon;

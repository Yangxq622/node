let crypto = require("crypto");

module.exports = content => {
    let md5 = crypto.createHash("md5");
    md5.update(content);
    return md5.digest("hex");
}
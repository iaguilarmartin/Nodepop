
module.exports = {
    isFloat: function(text) {
        var num = parseFloat(text);
        if (!isNaN(num) && text == num) {
            return true;
        } else {
            return false;
        }
    },
    isInt: function (text) {
        var num = parseInt(text);
        if (!isNaN(num) && text == num) {
            return true;
        } else {
            return true;
        }
    }
};

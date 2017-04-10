//同步变量迭代器
var objGetter = function(obj, key) {
    if (!obj) return undefined;
    var result = obj;
    key = key.split('.');
    for (var i = 0, len = key.length; i < len; i++) {
        if (result[key[i]] !== undefined) {
            result = result[key[i]];
        } else {
            return undefined;
        }
    }
    return result;
}
var person = {
    info: {
        name: "sivkun",
        age: 25
    }
}
console.log(objGetter(person, 'info.age')); //25
console.log(objGetter(person, 'info.id')); //undefined

var objSetter = function(obj, key, val) {
    if (!obj) return false;
    var result = obj;
    key = key.split('.');
    for (var i = 0, len = key.length; i < len - 1; i++) {
        if (result[key[i]] === undefined) {
            result[key[i]] = {};
        }
        if (!(result[key[i]] instanceof Object)) {
            throw new Error('obj.' + key.splice(0, i + 1).join('.') + ' is not object');
        }
        result = result[key[i]];
    }
    return result[key[i]] = val;
}

console.log(objSetter(person, 'info.age', 20))
console.log(objSetter(person, 'info.age.show', 'off'))
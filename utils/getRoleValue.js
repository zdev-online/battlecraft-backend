module.exports = function(role){
    let value = ["user", "moder", "admin"].indexOf(role);
    return value < 0 ? 0 : value;
}
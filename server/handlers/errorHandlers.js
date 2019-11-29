/*
  Catch Errors Handler
*/
exports.catchErrors = fn =>
    function(req, res, next) {
        return fn(req, res, next).catch(next);
    };

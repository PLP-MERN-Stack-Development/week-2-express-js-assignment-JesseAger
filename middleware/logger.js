module.exports = function (req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = {
    mongodb: {
        // хорошая идея с process.env.MONGODB_URI, т.к. менять параметры без комитов это хорошо
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/accounts'
    }
};

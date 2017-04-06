const app = require('./app');
const logger = require("./utils/logger");

const port = process.env.PORT || 8181;
app.listen(port, () => logger.log('Example app listening on port: ', port));

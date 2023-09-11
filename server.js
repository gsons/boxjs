const httpServer = require("http-server");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
require("dotenv").config();

const webpackConfig = require("./webpack.config.js")();
const compiler = webpack(webpackConfig);
webpackDevMiddleware(compiler);
var server = httpServer.createServer({ root: process.env.ROOT_DIR });
server.listen(process.env.LOCAL_PORT, process.env.LOCAL_HOST);

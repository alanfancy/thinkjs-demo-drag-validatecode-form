const view = require('think-view');
const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');

module.exports = [
  view, // 让框架支持视图的功能
  model(think.app), // 让框架支持模型的功能//将 think.app 传递给 model 扩展
  cache,
  session
];

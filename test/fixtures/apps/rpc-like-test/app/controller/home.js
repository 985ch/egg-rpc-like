'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(await ctx.rpcl('test').test());
    ctx.body = 'hi, ' + this.app.plugins.rpcLike.name;
  }
}

module.exports = HomeController;

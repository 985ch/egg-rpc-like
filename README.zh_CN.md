# egg-rpc-like

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-rpc-like.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-rpc-like
[travis-image]: https://img.shields.io/travis/985ch/egg-rpc-like.svg?style=flat-square
[travis-url]: https://travis-ci.org/985ch/egg-rpc-like
[codecov-image]: https://img.shields.io/codecov/c/github/985ch/egg-rpc-like.svg?style=flat-square
[codecov-url]: https://codecov.io/github/985ch/egg-rpc-like?branch=master
[david-image]: https://img.shields.io/david/985ch/egg-rpc-like.svg?style=flat-square
[david-url]: https://david-dm.org/985ch/egg-rpc-like
[snyk-image]: https://snyk.io/test/npm/egg-rpc-like/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-rpc-like
[download-image]: https://img.shields.io/npm/dm/egg-rpc-like.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-rpc-like

> 这个插件允许开发者把各种对远程服务器的操作统一封装成RPC的形式进行调用，无论是http请求，对数据库的操作还是使用其他的RPC插件都能以统一的形式封装起来。同时本插件也提供了几个对curl的封装方法供用户参考和使用。

## 安装插件

```bash
$ npm i egg-rpc-like --save
```

## 使用方法

```js
// config/plugin.js
exports.rpcLike = {
  enable: true,
  package: 'egg-rpc-like',
};
```
```js
// config/config.default.js
const generators = require('egg-rpc-like');

exports.rpcLike = {
  default: {
    $generator: generator.simpleCurl(data=>data), // or generator.functionCurl
  },
  clients: {
    serviceA: { // object name
      host: 'http://your.site.com',
      $members: [
        'test',
        { $key:'test2', api:'sample'},
      ],
    }
  },
};
```
```js
//use it in your controller or service
let data = await ctx.rpcl.serviceA.test({id:1}); // get data from http://your.site.com/test?id=1
let data = await app.rpcl.serviceA.test2(); // get data from http://your.site.com/sample
```

## 关于配置
* rpcl对象的生成基于[obj-gen-9](https://github.com/985ch/obj-gen-9)实现
* rpcl的每个子对象都会额外附加一个成员app，在生成函数的内部可以通过this.app来对其进行访问。参考[这个文件](./index.js)
* $generator用于生成你的rpcLike对象，你可以使用默认的[simpleCurl](#simpleCurl)或者[functionCurl](#functionCurl)，也可以自己编写生成器。
* 配置的格式依赖于$generator，不同的生成器需要的配置格式也各不相同。
* 更详细的配置可以参考[测试脚本](./test/fixtures/apps/rpc-like-test/config/config.default.js)

### simpleCurl
* simpleCurl需要传入一个函数用于把curl返回结果中的data字段处理为用户想要的结果，其格式为function(data}{return data;}
* simpleCurl生成的函数格式为async function(params){}，其中params为curl中options.data
* 使用simpleCurl时，配置中必须要有host，否则会产生一个错误
* member可以有两种格式：{$key:'name',api:'',options:''}和'name'，其中后者会被解析为{$key:'name',api:'name'}
* simpleCurl默认的options是{method:'GET',dataType:'json'}，也可以在member或config中指定，其中member中的options最优先

### functionCurl
* functionCurl要求返回的数据是一个JSON，并且格式必须是{err:-1,msg:'msg'}或{data:data}
* functionCurl生成的函数格式为async function(...argments){}，其中argments会被处理为数组并字符串化之后作为参数arg发送
* 使用functionCurl时，配置中必须要有host，否则会产生一个错误
* member可以有两种格式：{$key:'name',api:'',options:''}和'name'，其中后者会被解析为{$key:'name',api:'name'}
* functionCurl默认的options是{method:'GET',dataType:'json'}，也可以在member或config中指定，其中member中的options最优先

### 自定义生成器
由于可以在函数中获取app对象，因此也可以访问诸如app.sequelize和app.redis等对象，利用这一点可以制作出各种各样的生成器而不仅限于curl。<br />
生成器写法可以参考[这个脚本](./index.js)

## functionCurl对应的服务端示例

```js
// app/controller/sample.js
const Controller = require('egg').Controller;
class SampleController extends Controller {
  async sample() {
    const { ctx, service } = this;
    try {
        const args = JSON.parse(ctx.request.query.arg);
        const result = await service.sample(...args);
        ctx.body = { data: result };
      } catch (e) {
        ctx.body = {
          err: -1,
          msg: e.message,
        };
      }
  }
}
module.exports = SampleController;
```
```js
// app/service/sample.js
const Service = require('egg').Service;

class SampleService extends Service {
  async sample(a, b, c = 0) {
    return a + b + c;
  }
}

module.exports = SampleService;
```

## 单元测试

```sh
npm test
```

## License

[MIT](LICENSE)

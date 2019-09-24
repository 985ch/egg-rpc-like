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

> This plugin allows developers to access remote servers in the form of RPC, whether it is an http request, a database operation or use another RPC.

## [中文说明](./README.zh_CN.md)
## Install

```bash
$ npm i egg-rpc-like --save
```

## Usage

```js
// {app_root}/config/plugin.js
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

## Configuration
* The generation of rpcl objects is based on [obj-gen-9](https://github.com/985ch/obj-gen-9)
* Each child of rpcl will have an additional member **app**, which can be accessed inside this function via **this.app**. Reference [here](./index.js)
* **$generator** is used to generate your rpcLike object. You can use the default [simpleCurl](#simpleCurl) or [functionCurl](#functionCurl), or you can write your own generator.
* The format of the configuration depends on **$generator**, and different generators require different configuration formats.
* More detailed configuration can refer to [config.default.js](./test/fixtures/apps/rpc-like-test/config/config.default.js)

### simpleCurl
* **simpleCurl** needs to pass a function to process the data from curl() to the result the user wants, in the format **function(data}{return data;}**
* The function generated by **simpleCurl** is in the form of **async function(params){}**, where params is options.data in curl().
* When using **simpleCurl**, you must configure host, otherwise an error will be thrown.
* Member can be in two formats: {$key:'name', api:'', options:''} and 'name', where the latter will be parsed as {$key:'name', api: 'name' }
* The default options for **simpleCurl** are {method:'GET',dataType:'json'}, which can also be specified in member or config
* The configuration can use the onFail function to handle request failures.

### functionCurl
* **functionCurl** requires that the returned data be a JSON and the format must be {err:-1,msg:'msg'} or {data:data}
* The function generated by **functionCurl** is in the form of **async function(...argments){}**, where **argments** will be processed as an array and stringed as a parameter **arg**.
* When using **functionCurl**, you must configure host, otherwise an error will be thrown.
* Member can be in two formats: {$key:'name', api:'', options:''} and 'name', where the latter will be parsed as {$key:'name', api: 'name' }
* The default options for **functionCurl** are {method:'GET',dataType:'json'}, which can also be specified in member or config
* The configuration can use the onFail function to handle request failures, and the onError function to handle RPC method errors.

### Custom generator
Reference [here](./index.js)

## Server example of functionCurl

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

## Unit tests

```sh
npm test
```

## License

[MIT](LICENSE)<br />
This README was translate by [google](https://translate.google.cn)

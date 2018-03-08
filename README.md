# egg-passport-flyme

flyme passport plugin for egg

## Install

```bash
$ npm i egg-passport-flyme --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.passportFlyme = {
  enable: true,
  package: 'egg-passport-flyme',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.passportFlyme = {
    rsaPrivateKey: 'your rsa private key',
    service:'your service name',
    callbackURL:'/passport/flyme/callback'
};
```

*注： 无需在router.js中挂载鉴权路由， 只要配置好加载该插件时会自挂载 /passpost/flyme 和 /passport/flyme/callback

see [config/config.default.js](config/config.default.js) for more detail.


## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)

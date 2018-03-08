/**
 * Created by null on 18-3-7.
 */
'use strict';

const debug = require('debug')('egg-passport-flyme');
const assert = require('assert');
const Strategy = require('passport-custom').Strategy;
const Rsa = require('node-rsa');
const rp = require('request-promise');
module.exports = app => {
    const config = app.config.passportFlyme;
    assert(config.rsaPrivateKey, '[egg-passport-flyme] config.rsaPrivateKey required');
    assert(config.service, '[egg-passport-flyme] config.service required');

    const rsa = new Rsa();
    rsa.importKey(config.rsaPrivateKey, 'pkcs8-private-pem');
    const key = rsa.exportKey();
    const signParams = function (oParams) {
        let str = '';
        for (let key in oParams) {
            str += (key + '=' + oParams[key]);
        }
        const r = new Rsa(key, {signingScheme: 'sha1'});
        str = r.sign(str).toString('base64');
        return encodeURIComponent(str)
    };

    app.passport.use('flyme', new Strategy((req, done) => {
        const ticket = req.query.ticket;
        const signStr = signParams({ticket});
        const url = `https://i.flyme.cn/uc/sign/getLoginInfoByTicket?ticket=${ticket}&sign=${signStr}&service=${config.service}`;
        rp(url).then((res) => {
            try{
                res = JSON.parse(res)
            }catch (e){
                return done('egg-passport-flyme: Parse response json error!');
            }

            if(res.code !== '200') return done('egg-passport-flyme: ' + res.message);
            const user = {
                provider:'flyme',
                id: res.value.uid,
                name: res.value.name,
                displayName:res.value.nickname,
                photo:res.value.icon,
                accessToken:'',
                params:'',
                profile:res.value
            };
            app.passport.doVerify(req, user, done)
        });
    }));

    const flyme = app.passport.authenticate('flyme', {});
    app.get('/passport/flyme', async (ctx, next)=>{
        const appuri = encodeURIComponent(`${ctx.origin}${config.callbackURL}`);
        const useruri = encodeURIComponent(ctx.params.useruri || ctx.origin);
        const url = `https://login.in.meizu.com/sso?lang=en_US&appuri=${appuri}&service=${config.service}&useruri=${useruri}`;
        ctx.redirect(url);
    });

    app.get('/passport/flyme/callback', flyme);
};
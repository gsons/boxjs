(()=>{"use strict";var t,e=function(t,e,n,o){return new(n||(n=Promise))((function(s,r){function i(t){try{a(o.next(t))}catch(t){r(t)}}function u(t){try{a(o.throw(t))}catch(t){r(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}a((o=o.apply(t,e||[])).next())}))},n=function(t,e){var n,o,s,r,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return r={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function u(r){return function(u){return function(r){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,o&&(s=2&r[0]?o.return:r[0]?o.throw||((s=o.return)&&s.call(o),0):o.next)&&!(s=s.call(o,r[1])).done)return s;switch(o=0,s&&(r=[2&r[0],s.value]),r[0]){case 0:case 1:s=r;break;case 4:return i.label++,{value:r[1],done:!1};case 5:i.label++,o=r[1],r=[0];continue;case 7:r=i.ops.pop(),i.trys.pop();continue;default:if(!((s=(s=i.trys).length>0&&s[s.length-1])||6!==r[0]&&2!==r[0])){i=0;continue}if(3===r[0]&&(!s||r[1]>s[0]&&r[1]<s[3])){i.label=r[1];break}if(6===r[0]&&i.label<s[1]){i.label=s[1],s=r;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(r);break}s[2]&&i.ops.pop(),i.trys.pop();continue}r=e.call(t,i)}catch(t){r=[6,t],o=0}finally{n=s=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,u])}}},o=function(t,e,n){if(n||2===arguments.length)for(var o,s=0,r=e.length;s<r;s++)!o&&s in e||(o||(o=Array.prototype.slice.call(e,0,s)),o[s]=e[s]);return t.concat(o||Array.prototype.slice.call(e))};!function(t){t[t.Surge=0]="Surge",t[t.Loon=1]="Loon",t[t.QuanX=2]="QuanX",t[t.Shadowrocket=3]="Shadowrocket",t[t.Node=4]="Node"}(t||(t={}));const s=function(){function s(t,e){this.response={},this.name=t,this.namespace=e,this.logMsg=[],this.logSeparator="",this.startTime=(new Date).getTime(),this.log("🔔".concat(this.name,", 开始!")),this.initEnv()}return s.prototype.done=function(e){void 0===e&&(e={});var n=((new Date).getTime()-this.startTime)/1e3;if(this.log("🔔".concat(this.name,", 结束! 🕛 ").concat(n," 秒")),console.log("本次运行日志已缓存到变量 ".concat(this.namespace+"."+s.APP_LOG_KEY)),console.log("response: "+JSON.stringify(this.response)),this.env==t.Node)process.exit(1);else{var o=this.getStore(s.APP_LOG_KEY,!0);o=o||""+this.logMsg.join("\n"),this.setStore(s.APP_LOG_KEY,o,!0),$done(e)}},s.prototype.getStore=function(e,n){return void 0===n&&(n=!1),n&&(e=this.namespace+"."+e),this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?$persistentStore.read(e):this.env==t.QuanX?$prefs.valueForKey(e):null},s.prototype.msg=function(e,n,o){this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?$notification.post(e,n,o):this.env==t.QuanX&&$notify(e,n,o)},s.prototype.log=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];(e=e.map((function(e){return t.date("yyyy-MM-dd HH:mm:ss")+" "+e+"\n"}))).length>0&&(this.logMsg=o(o([],this.logMsg,!0),e,!0)),console.log(e.join(this.logSeparator))},s.prototype.date=function(t,e){void 0===e&&(e=null);var n=e?new Date(e):new Date,o={"M+":n.getMonth()+1,"d+":n.getDate(),"H+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};for(var s in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length))),o){var r=o[s];new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?r:("00"+r).substr((""+r).length)))}return t},s.prototype.httpResponse=function(t){this.response={response:{status:200,body:JSON.stringify(t),headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,GET","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"}}}},s.prototype.send=function(t){var e=this;return new Promise((function(n,o){e.doRequest(t,(function(t,e,s){t?o(t):n(s)}))}))},s.prototype.post=function(t){return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return t.method="post",[4,this.send(t)];case 1:return[2,e.sent()]}}))}))},s.prototype.get=function(t){return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return t.method="get",[4,this.send(t)];case 1:return[2,e.sent()]}}))}))},s.prototype.doRequest=function(e,n){void 0===n&&(n=function(t,e,n){});var o=e.method?e.method.toLocaleLowerCase():"post";e.body&&e.headers&&!e.headers["Content-Type"]&&(e.headers["Content-Type"]="application/x-www-form-urlencoded"),e.headers&&delete e.headers["Content-Length"],this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?(this.env==t.Surge&&this.isNeedRewrite&&(e.headers=e.headers||{},Object.assign(e.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[o](e,(function(t,e,o){!t&&e&&(e.body=o,e.statusCode=e.status?e.status:e.statusCode,e.status=e.statusCode),n(t,e,o)}))):this.env==t.QuanX?(e.method=o,this.isNeedRewrite&&(e.opts=e.opts||{},Object.assign(e.opts,{hints:!1})),$task.fetch(e).then((function(t){var e=t.statusCode,o=t.statusCode,s=t.headers,r=t.body;n(null,{status:e,statusCode:o,headers:s,body:r},r)}),(function(t){return n(t&&t.error||"UndefinedError",null,null)}))):this.env==t.Node&&(console.log(this.env),$nodeHttpClient.get("https://api.juejin.cn/tag_api/v1/query_category_briefs",(function(t){var e=[];t.on("data",(function(t){e.push(t)})),t.on("end",(function(){var t=JSON.parse(Buffer.concat(e).toString());console.log(t),n(null,t,null)}))})).on("error",(function(t){console.log("Error: ",t.message)})))},s.prototype.setStore=function(e,n,o){return void 0===o&&(o=!1),o&&(e=this.namespace+"."+e),this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?$persistentStore.write(n,e):this.env==t.QuanX&&$prefs.setValueForKey(n,e)},s.prototype.initEnv=function(){"undefined"!=typeof $task?this.env=t.QuanX:"undefined"!=typeof $httpClient&&"undefined"==typeof $loon?this.env=t.Surge:"undefined"!=typeof $loon?this.env=t.Loon:"undefined"!=typeof $rocket?this.env=t.Shadowrocket:this.env=t.Node},s.APP_LOG_KEY="boxjs-log",s}();var r,i,u=(r=function(t,e){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},r(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),a=function(t,e,n,o){return new(n||(n=Promise))((function(s,r){function i(t){try{a(o.next(t))}catch(t){r(t)}}function u(t){try{a(o.throw(t))}catch(t){r(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}a((o=o.apply(t,e||[])).next())}))},c=function(t,e){var n,o,s,r,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return r={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function u(r){return function(u){return function(r){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,o&&(s=2&r[0]?o.return:r[0]?o.throw||((s=o.return)&&s.call(o),0):o.next)&&!(s=s.call(o,r[1])).done)return s;switch(o=0,s&&(r=[2&r[0],s.value]),r[0]){case 0:case 1:s=r;break;case 4:return i.label++,{value:r[1],done:!1};case 5:i.label++,o=r[1],r=[0];continue;case 7:r=i.ops.pop(),i.trys.pop();continue;default:if(!((s=(s=i.trys).length>0&&s[s.length-1])||6!==r[0]&&2!==r[0])){i=0;continue}if(3===r[0]&&(!s||r[1]>s[0]&&r[1]<s[3])){i.label=r[1];break}if(6===r[0]&&i.label<s[1]){i.label=s[1],s=r;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(r);break}s[2]&&i.ops.pop(),i.trys.pop();continue}r=e.call(t,i)}catch(t){r=[6,t],o=0}finally{n=s=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,u])}}};!function(t){t[t.WEB_HTTP=0]="WEB_HTTP",t[t.LOG_HTTP=1]="LOG_HTTP",t[t.SIGN_COOKIE=2]="SIGN_COOKIE",t[t.SIGN=3]="SIGN"}(i||(i={}));var h=function(t){function e(e,n){var o=t.call(this,e,n)||this;return o.signurlKey="sign_url",o.signheaderKey="sign_header",o.initEvent(),o}return u(e,t),e.prototype.dispatchEvent=function(){return a(this,void 0,void 0,(function(){return c(this,(function(t){switch(t.label){case 0:switch(this.event){case i.WEB_HTTP:return[3,1];case i.LOG_HTTP:return[3,3];case i.SIGN_COOKIE:return[3,4];case i.SIGN:return[3,5]}return[3,7];case 1:return[4,this.handelWebHttp()];case 2:case 6:case 8:return t.sent(),[3,9];case 3:return this.handelLogHttp(),[3,9];case 4:return this.handelSignCookie(),[3,9];case 5:case 7:return[4,this.handelSign()];case 9:return[2]}}))}))},e.prototype.handelSign=function(){return a(this,void 0,void 0,(function(){var t,e,n,o,s;return c(this,(function(r){switch(r.label){case 0:return t=JSON.parse(this.getStore(this.signheaderKey,!0)),e=this.getStore(this.signurlKey,!0),n=/https?:\/\/.*?\//.exec(e)[0],o={url:"".concat(n,"user/checkin"),headers:t},this.log("Http request:"+o.url),[4,this.post(o)];case 1:return s=r.sent(),s=JSON.parse(s),this.msg(this.name,s.msg,JSON.stringify(s)),[2]}}))}))},e.prototype.handelSignCookie=function(){this.setStore(this.signurlKey,$request.url,!0),this.setStore(this.signheaderKey,JSON.stringify($request.headers),!0),this.msg(this.name,"获取Cookie: 成功 (筋斗云)","")},e.prototype.handelLogHttp=function(){var t=this.getStore(s.APP_LOG_KEY,!0);this.httpResponse(t)},e.prototype.handelWebHttp=function(){return a(this,void 0,void 0,(function(){var t,e,n,o,s;return c(this,(function(r){switch(r.label){case 0:return t=this.getStore(this.signurlKey,!0),e=JSON.parse(this.getStore(this.signheaderKey,!0)),n={url:t,headers:e},o=null,[4,this.get(n)];case 1:s=r.sent();try{o=this.fetchJindouyun(s)}catch(t){this.log("获取筋斗云个人信息失败:"+t),this.msg(l,"获取筋斗云个人信息失败",t)}return(new Date).getTime(),this.date("yyyy-MM-dd HH:mm:ss"),this.httpResponse(o),[2]}}))}))},e.prototype.initEvent=function(){"undefined"!=typeof $request&&"OPTIONS"!=$request.method&&/^https?:\/\/(www\.|)somersaultcloud\.(xyz|top)\/user$/.test($request.url)?this.event=i.SIGN_COOKIE:"undefined"!=typeof $request&&"OPTIONS"!=$request.method&&/^https?:\/\/jindouyun\.json/.test($request.url)?this.event=i.WEB_HTTP:"undefined"!=typeof $request&&"OPTIONS"!=$request.method&&/^https?:\/\/jindouyun\.log/.test($request.url)?this.event=i.LOG_HTTP:this.event=i.SIGN},e.prototype.fetchJindouyun=function(t){var e=/<h4>剩余流量<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(.*)?<\/span> (MB|GB|KB)/.exec(t),n=e[1],o=e[2],s=/<h4>同时在线设备数<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(\d+)<\/span> \/ <span class="counterup">(\d+)<\/span>/.exec(t),r={remain_flow:n+o,online:s[1],sum:s[2],used_flow:/今日已用: (.*?)<\/li>/.exec(t)[1],last_used_date:/上次使用时间: (.*?)<\/li>/.exec(t)[1],momey:/<h4>钱包余额<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+¥\s+<span class="counter">(.*)?<\/span>/.exec(t)[1],commission:/累计获得返利金额: ¥(.*?)<\/li>/.exec(t)[1]};return this.log("↓ fetchJindouyun"),this.log(JSON.stringify(r)),r},e}(s),l="筋斗云机场",p=new h(l,"gsonhub.somersaultcloud");p.dispatchEvent().catch((function(t){p.log("EEEEEEEEEERRRRRRRRRRR"+t)})).finally((function(){p.done(p.response)}))})();
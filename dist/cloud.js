(()=>{var t={792:()=>{},843:t=>{"use strict";t.exports={}}},e={};function s(o){var i=e[o];if(void 0!==i)return i.exports;var n=e[o]={exports:{}};return t[o](n,n.exports,s),n.exports}(()=>{"use strict";var t,e,o;!function(t){t.Surge="Surge",t.Loon="Loon",t.QuanX="QuanX",t.Shadowrocket="Shadowrocket",t.Node="Node"}(t||(t={})),function(t){t.Response="http-response",t.Request="http-request",t.Script="run-script"}(e||(e={})),function(t){t[t.BASE=0]="BASE",t[t.HTTP=1]="HTTP",t[t.SYS=2]="SYS",t[t.OTHER=3]="OTHER"}(o||(o={}));class i extends Error{constructor(t,e=o.BASE){super(t),this.name="baseErr",this.code=e,this.stack=(new Error).stack,Object.setPrototypeOf(this,i.prototype)}}class n{constructor(t,e){this.isMute=!1,this.logList=[],this.logSeparator="\n\n",this.appName=t,this.namespace=e,this.startTime=(new Date).getTime(),this.log(`🔔${this.appName}, 开始!`),this.initAction(),this.initEnv();let o=this.getStore("mute");this.isMute="true"==o,s(843)}initAction(){"undefined"!=typeof $response?this.action=e.Response:"undefined"!=typeof $request?this.action=e.Request:this.action=e.Script,this.log("脚本类型为："+this.action)}async doAction(){switch(this.action){case e.Request:this.result=await this.doRequestAction($request);break;case e.Response:this.result=await this.doResponseAction($request,$response);break;case e.Script:this.result=await this.doScriptAction();break;default:this.log(this.appName,"Unknow Action","未知的脚本类型"),this.result=!1}!1===this.result&&this.msg(this.appName,"不合法的脚本","请检查脚本配置信息")}run(){this.doAction().catch((t=>{t instanceof i?(this.log(""+t.code),t.code==o.BASE?this.msg(this.appName,t.message,""):t.code==o.HTTP?Math.random()>.8?this.msg(this.appName,"网络异常："+t.message,""):this.log(this.appName,"网络异常Log:"+t.message,""):this.log(t.message,"")):this.log(t),this.result=this.ajaxFailResult(t.message||t)})).finally((()=>{this.done()}))}transParams(t){return Object.keys(t).map((e=>`${e}=${encodeURIComponent(t[e])}`)).join("&")}httpResponseResult(e,s={}){return{response:{status:this.env===t.QuanX?"HTTP/1.1 200":200,body:"string"==typeof e?e:JSON.stringify(e),headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,GET","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept",...s}}}}randomString(t){for(var e="",s=0;s<t;s++)e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62*Math.random()));return e}handelLogHttp(){this.log(`运行 》 ${this.appName}系统运行日志http服务器`);let t=this.getStore(n.APP_LOG_KEY)||"";const e=new RegExp(this.logSeparator,"g");return t=t.replace(e,"<br>"),this.httpResponseResult(t,{"Content-Type":"text/html;charset=utf-8"})}send(t){return new Promise(((e,s)=>{this.doRequest(t,((t,n,r)=>{t?s(new i(t,o.HTTP)):e(n)}))}))}async post(t){return t.method="post",await this.send(t)}async get(t){return t.method="get",await this.send(t)}doRequest(e,s=((t,e,s)=>{})){const o=e.method?e.method.toLocaleLowerCase():"post";e.body&&e.headers&&!e.headers["Content-Type"]&&(e.headers["Content-Type"]="application/x-www-form-urlencoded"),e.headers&&delete e.headers["Content-Length"],this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?(this.env==t.Surge&&this.isNeedRewrite&&(e.headers=e.headers||{},Object.assign(e.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[o](e,((t,e,o)=>{!t&&e&&(e.body=o,e.statusCode=e.status?e.status:e.statusCode,e.status=e.statusCode),s(t,e,o)}))):this.env==t.QuanX?(e.method=o,this.isNeedRewrite&&(e.opts=e.opts||{},Object.assign(e.opts,{hints:!1})),$task.fetch(e).then((t=>{const{statusCode:e,statusCode:o,headers:i,body:n}=t;s(null,{status:e,statusCode:o,headers:i,body:n},n)}),(t=>s(t&&t.error||"UndefinedError",null,null)))):this.env==t.Node&&this.print("nodejs http request",e,this.env)}sleep(t){return new Promise((e=>setTimeout(e,t)))}ajaxSuccessResult(t,e=null){let s={time:+new Date,datetime:this.date("yyyy-MM-dd HH:mm:ss"),code:1,msg:t,data:e};return this.httpResponseResult(s)}ajaxFailResult(t,e=null){let s={time:+new Date,datetime:this.date("yyyy-MM-dd HH:mm:ss"),code:0,msg:t,data:e};return this.httpResponseResult(s)}done(){const s=((new Date).getTime()-this.startTime)/1e3;if(this.action===e.Script&&this.print("运行 response: "+JSON.stringify(this.result)),this.log(`🔔${this.appName}, 结束! 🕛 ${s} 秒 ${this.logSeparator}`),this.env==t.Node)process.exit(1);else{let t=this.getStore(n.APP_LOG_KEY)||"";t=t.split(this.logSeparator).slice(0,1e4).join(this.logSeparator),t=this.logList.join("")+t,this.setStore(n.APP_LOG_KEY,t),this.print("注意本次运行日志已缓存到变量 "+this.namespace+"."+n.APP_LOG_KEY),this.result?$done(this.result):$done({})}}msg(e,s,o){this.isMute||(this.log("==============📣系统通知📣=============="+this.logSeparator+e+this.logSeparator+s+this.logSeparator+o),this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?$notification.post(e,s,o):this.env==t.QuanX&&$notify(e,s,o))}print(...t){t=t.map((t=>this.date("yyyy-MM-dd HH:mm:ss")+" "+t+this.logSeparator)),console.log(t.join(this.logSeparator))}log(...t){(t=t.map((t=>this.date("yyyy-MM-dd HH:mm:ss")+" "+("string"==typeof t?t:JSON.stringify(t))+this.logSeparator))).length>0&&(this.logList=[...this.logList,...t]),console.log(t.join(this.logSeparator))}getStore(e,s=!0){return s&&(e=this.namespace+"."+e),this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?$persistentStore.read(e):this.env==t.QuanX?$prefs.valueForKey(e):null}setStore(e,s,o=!0){return o&&(e=this.namespace+"."+e),this.env==t.Surge||this.env==t.Shadowrocket||this.env==t.Loon?$persistentStore.write(s,e):this.env==t.QuanX&&$prefs.setValueForKey(s,e)}initEnv(){"undefined"!=typeof $task?this.env=t.QuanX:"undefined"!=typeof $loon?this.env=t.Loon:"undefined"!=typeof $rocket?this.env=t.Shadowrocket:"undefined"!=typeof $httpClient&&"undefined"==typeof $loon?this.env=t.Surge:this.env=t.Node,this.log("当前APP为: "+this.env)}date(t,e=""){const s=e?new Date(e):new Date;let o={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in o){let s=o[e];new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s:("00"+s).substr((""+s).length)))}return t}getSignCount(){let t=this.getStore("sign_count"),e=this.date("yyyyMMdd");if(t){let[s,o]=t.split("_");return s==e&&o?Number(o):(this.setStore("sign_count",`${e}_0`),0)}return this.setStore("sign_count",`${e}_0`),0}incSignCount(){let t=this.getSignCount();t++;let e=this.date("yyyyMMdd");this.setStore("sign_count",`${e}_${t}`)}}n.APP_LOG_KEY="boxjs-log";const r=n;s(792),new class extends r{constructor(t,e){super(t,e),this.BASE_URL="",this.BASE_URL=this.getStore("domain_url")??"https://www.somersaultcloud.xyz"}async doRequestAction(t){if(t.url.includes("cloud.log"))return this.handelLogHttp();if(t.url.includes("/user/profile")){if(t.headers&&t.headers.Cookie){this.log("读取header成功",t.headers),this.setStore("login_cookie",t.headers.Cookie),this.log("读取cookie成功",t.headers.Cookie),this.msg(this.appName,"读取cookie成功","");const[e]=/^https?:\/\/(www\.|)somersaultcloud\.(xyz|top)/.exec(t.url)??[];this.setStore("domain_url",e??this.BASE_URL),this.log("domain_url "+e)}else this.log("读取cookie失败",t.headers),this.msg(this.appName,"读取cookie失败","");return{}}if(!t.url.includes("cloud.json"))return!1;{const t=`${this.BASE_URL}/user`,e={url:t,headers:{Cookie:this.getStore("login_cookie")??"","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42",referer:t}},s=await this.get(e);try{const t=this.exportData(s.body);return this.ajaxSuccessResult("获取个人信息",t)}catch(t){throw new i("登录状态可能已经失效,"+t?.message)}}}doResponseAction(t,e){return!1}async doScriptAction(){if("auto_sign_ip"==$argument){await this.sleep(1e4);let t=await this.get({url:"https://whois.pconline.com.cn/ipJson.jsp"}),e="";try{let s=t.body.match(/\d+\.\d+\.\d+\.\d+/);if(!s||!s[0])throw new i("获取IP外网失败,"+t.body);{e=s[0],this.log("获取到当前外网ip地址 "+e);let t=this.getStore("ip_list"),o=[];if(t&&(o=JSON.parse(t)),o.includes(e))return this.log("ip地址 "+e+"已经加白，无需加白！"),{};o.push(e),this.setStore("ip_list",JSON.stringify(o))}}catch(e){throw new i("获取IP外网失败 "+e+"=>res.body"+t.body)}this.log(`IP白名单start $argument=${$argument}`);let s=["http://hk-trail.somnode.top","http://us-trail.somnode.top","http://jp-trail.somnode.top","http://sg-trail.somnode.top","http://tw-trail.somnode.top","http://ru-trail.somnode.top","http://hk-i.somnode.top","http://hk-ii.somnode.top","http://hk-iii.somnode.top","http://hk-a.somnode.top","http://hk-b.somnode.top","http://hk-c.somnode.top","http://hk-d.somnode.top","http://hk-e.somnode.top","http://hk-f.somnode.top","http://hk-m.somnode.top"],o=s[Math.floor(Math.random()*s.length)]+"/addallip.php";s=s.map((t=>t+"/addip.php")),s.push(o);const n=s.map((async t=>{const e={url:t,headers:{Cookie:this.getStore("login_cookie")??"","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42",referer:t}};try{(await this.get(e)).body.includes("Cloudflare")?this.log(`加白失败!Cloudflare,${t}`):this.log(`加白成功!,${t}`)}catch(e){this.log(`http request error:${e} url:${t}`)}}));return await Promise.all(n).catch((t=>{this.log("http promise all error:"+t)})),this.log(`IP白名单end $random_url=${o}`),{}}return await this.handelSign(),{}}async handelSign(){this.log("运行 》 筋斗云签到");const t=`${this.BASE_URL}/user/checkin`,e={url:t,headers:{Cookie:this.getStore("login_cookie")??"","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42",referer:t}};this.log("Http request:"+e.url);let s=await this.post(e);try{const t=JSON.parse(s.body);t&&t?.ret?this.msg(this.appName,t.msg,JSON.stringify(t)):this.log(s.body)}catch(t){throw new i("登录状态可能已经失效,"+t?.message)}}exportData(t){let[,e,s]=/<h4>剩余流量<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(.*)?<\/span> (MB|GB|KB)/.exec(t)??[],[,o,i]=/<h4>同时在线设备数<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(\d+)<\/span> \/ <span class="counterup">(\d+)<\/span>/.exec(t)??[],[,n]=/今日已用: (.*?)<\/li>/.exec(t)??[],[,r]=/上次使用时间: (.*?)<\/li>/.exec(t)??[],[,a]=/<h4>钱包余额<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+¥\s+<span class="counter">(.*)?<\/span>/.exec(t)??[],[,h]=/累计获得返利金额: ¥(.*?)<\/li>/.exec(t)??[],l={remain_flow:e+s,online:o,sum:i,used_flow:n,last_used_date:r,momey:a,commission:h};return this.log("↓ exportData"),this.log(JSON.stringify(l)),l}}("筋斗云","gsonhub.cloud").run()})()})();
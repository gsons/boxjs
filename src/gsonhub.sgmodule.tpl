#!name= gsonhub的脚本
#!desc= 筋斗云定时签到，查询筋斗云个人信息接口服务

[MITM] 
hostname = %APPEND% somersaultcloud.top,www.somersaultcloud.xyz

[General]
force-http-engine-hosts = %APPEND% somersaultcloud.json somersaultcloud.log

[Script]

# 筋斗云获取cookie
somersaultcloud = type=http-request,pattern=^https?:\/\/(www\.|)somersaultcloud\.(xyz|top)\/user$,script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/somersaultcloud.js?v=VERSION,timeout=10

# 筋斗云定时签到
somersaultcloud-cron = type=cron,cronexp=0 0 * * *,timeout=30,script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/somersaultcloud.js?v=VERSION

# 查询筋斗云个人信息接口服务 http://somersaultcloud.json  查询筋斗云运行日志 http://somersaultcloud.log
somersaultcloud-service = type=http-request,pattern=^https?:\/\/somersaultcloud\.(json|log),script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/somersaultcloud.js?v=VERSION,requires-body=true,max-size=0,timeout=10

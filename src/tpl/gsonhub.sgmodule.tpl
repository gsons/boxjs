#!name= gsonhub的脚本v=VERSION
#!desc= 筋斗云定时签到，查询筋斗云个人信息接口服务v=VERSION

[MITM] 
hostname = %APPEND% somersaultcloud.top,www.somersaultcloud.xyz

[General]
force-http-engine-hosts = %APPEND% somersaultcloud.json somersaultcloud.log 10010.json 10010.log

[Script]

# 轮询 查询流量
10010-for-cron = type=cron,cronexp=*/1 * * * * ?,timeout=10,script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/10010.js?v=VERSION

# 查询流量接口服务  http://10010.json 查询联通日志 http://10010.log 
10010-http-service = type=http-request,pattern=^https?:\/\/10010\.(json|log),script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/10010.js?v=VERSION,requires-body=true,max-size=0,timeout=10


# 筋斗云获取cookie
somersaultcloud = type=http-request,pattern=^https?:\/\/(www\.|)somersaultcloud\.(xyz|top)\/user$,script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/somersaultcloud.js?v=VERSION,timeout=10

# 筋斗云定时签到
somersaultcloud-cron = type=cron,cronexp=0 0 * * *,timeout=30,script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/somersaultcloud.js?v=VERSION

# 查询筋斗云个人信息接口服务 http://somersaultcloud.json  查询筋斗云运行日志 http://somersaultcloud.log
somersaultcloud-service = type=http-request,pattern=^https?:\/\/somersaultcloud\.(json|log),script-path=https://raw.githubusercontent.com/gsons/boxjs/main/dist/somersaultcloud.js?v=VERSION,requires-body=true,max-size=0,timeout=10

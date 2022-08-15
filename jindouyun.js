const cookieName = '筋斗云签到'
const signurlKey = 'gsons_jindouyun_url'
const signheaderKey = 'gsons_jindouyun_header'

const chavy = init()


if ($request && $request.method != 'OPTIONS' && /https:\/\/www.somersaultcloud\.xyz\/user$/.test($request.url)) {
    const loginlotteryurlVal = $request.url
    const loginlotteryheaderVal = JSON.stringify($request.headers)
    if (loginlotteryurlVal) chavy.setdata(loginlotteryurlVal, signurlKey)
    if (loginlotteryheaderVal) chavy.setdata(loginlotteryheaderVal, signheaderKey)
    chavy.msg(cookieName, `获取Cookie: 成功 (筋斗云)`, ``)
} else {
    let url = chavy.getdata(signurlKey);
    let header = JSON.parse(chavy.getdata(signheaderKey));
    let obj = {
        url: 'https://www.somersaultcloud.xyz/user/checkin',
        headers: header,
    };

    chavy.post(obj, (error, response, data) => {
        let vo=JSON.parse(data);
        chavy.msg(cookieName, vo.msg,(JSON.stringify(vo)))
        chavy.done();
    })
}





function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}

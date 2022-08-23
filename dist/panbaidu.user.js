// ==UserScript==
// @name         panbaidu
// @namespace    com.gsonhub
// @version      0.1
// @description  获取百度云直链
// @author       gsonhub
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @connect      yyxxs.cn
// @connect      softxm.cn
// @connect      softxm.vip
// @connect      42.193.51.61
// @connect      119.28.33.23
// @connect      119.28.139.214
// @connect      49.234.47.193
// @connect      82.156.65.179
// @connect      42.193.127.85
// @connect      81.70.253.99
// @connect      49.232.252.126
// @connect      82.156.15.149
// @connect      59.110.224.13
// @connect      59.110.225.22
// @connect      59.110.226.3
// @connect      baidu.com
// ==/UserScript==

(async function () {
    'use strict';

    let isOldHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/home") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isNewHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/main") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isSharePage = function () {
        let path = location.pathname.replace('/disk/', '');
        if (/^\/(s|share)\//.test(path)) {
            return true;
        } else {
            return false;
        }
    }

    let getPageType = function () {
        if (isOldHomePage()) return 'old';
        if (isNewHomePage()) return 'new';
        if (isSharePage()) return 'share';
        return '';
    }

    let getSelectedFileList = function () {
        let pageType = getPageType();
        if (pageType === 'old') {
            return require('system-core:context/context.js').instanceForSystem.list.getSelected();
        }
        else if (pageType === 'new') {
            let mainList = document.querySelector('.nd-main-list');
            if (!mainList) mainList = document.querySelector('.nd-new-main-list');//20220524 新版
            return mainList.__vue__.selectedList;
        }
        throw new Error('该页面不支持，必须先转存到自己网盘中，然后进入网盘进行下载');
    };

    let getFileListStat = function (item) {
        return {
            file_num: item.isdir == 0 ? 1 : 0,
            dir_num: item.isdir == 0 ? 1 : 0
        };
    };

    function getRndPwd(len) {
        len = len || 4;
        let $chars = 'AEJPTZaejptz258';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function doRequest(option) {
        let name = option.name ?? '';
        let url = option.url ?? '';
        return new Promise((resolve, reject) => {
            let config = {
                method: 'POST',
                responseType: 'json',
                timeout: 10000, // 10秒超时
                url: url,
                data: '',
                onload: (res) => {
                    if (res.status = 200) {
                        resolve(res.response || res.responseText);
                    } else {
                        reject(`请求${name}（${url}）网络时状态码错误：${res.status}`);
                    }
                },
                ontimeout: () => {
                    reject(`请求${name}（${url}）网络时超时，请检查网络后再试`);
                },
                onerror: () => {
                    reject(`请求${name}（${url}）网络时发生未知错误，请稍后再试`);
                }
            };
            config = Object.assign(config, option);
            GM_xmlhttpRequest(config);
        });

    }



    async function doShare(theFile, pwd) {
        console.log('开始分享文件');
        let url = `/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=&clienttype=0`;
        let data = `fid_list=[${theFile.fs_id}]&schannel=4&channel_list=[]&period=1&pwd=${pwd}`;
        let res = await doRequest({ name: '百度云分享', url: url, data: data });
        if (res && res.errno === 0) {
            console.log('结束分享文件', res);
            return res;
        } else {
            throw new Error('分享文件失败！' + JSON.stringify(res));
        }
    }


    async function getUInfo() {
        console.log('开始获取UInfo');
        let url = "https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&" + new Date().getTime();
        let res = await doRequest({ name: '百度云用户信息', url: url, method: 'get' });
        console.log('结束获取UInfo', res);
        return res;
    }

    async function getDownloadDomain() {
        console.log('开始获取百度云下载域名');
        let bdUrl = "https://pan.baidu.com/pcloud/user/getinfo?query_uk=477485340" + '&' + new Date().getTime();
        let res = await doRequest({ name: '百度云域名信息', url: bdUrl, method: 'get' });
        if (res && res.errno === 0) {
            console.log('结束获取百度云下载域名', res.user_info.intro);
            return res.user_info.intro
        } else {
            throw new Error('获取百度云下载域名失败');
        }
    }

    let globalData = {
        scriptVersion: '1.5.5',
        domain: 'http://82.156.65.179',
        domainB: 'http://bd.yyxxs.cn',
        domainC: 'http://82.156.15.149',
        domainD: 'http://42.193.51.61',
        domainE: 'http://81.70.253.99',
        domainF: 'http://119.28.139.214',
        domainG: 'http://49.234.47.193',
        // domainH: 'http://localhost:48818',
        param: '',
        downloading: 0,
        sending: 0,
        storageNamePrefix: 'softxm_storageName', // 本地储存名称前缀
        paramDomain: `https://softxm.lanzoui.com`, // 教程跳转地址
        paramDomain2: `https://pic.rmb.bdstatic.com`, // 教程跳转地址
    }

    let getAppSettingData = function () {
        return {
            scriptVersion: globalData.scriptVersion,
            param: globalData.param,
            storageNamePrefix: globalData.storageNamePrefix,
            getDownloadUrl: `/bd/getDownloadUrl2.php`,
            aria2DownloadUrl: `${globalData.paramDomain}/b01nqc7yj`, // Aria2软件下载地址
            aria2CourseUrl: `https://www.cnblogs.com/softxmm/p/13972678.html#aria2`, // Aria2教程地址
            idmDownloadUrl: `https://www.cnblogs.com/softxmm/p/13972678.html#idm`, // idm教程地址
        }
    }

    let getStorage = {
        getAppConfig: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_app_' + key) || '';
        },
        setAppConfig: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_app_' + key, value || '');
        },
        getLastUse: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_last_' + key) || '';
        },
        setLastUse: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_last_' + key, value || '');
        },
        getCommonValue: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_common_' + key) || '';
        },
        setCommonValue: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_common_' + key, value || '');
        }
    }

    async function getRealDownloadUrl(domain, share_res, uInfo, pwd, theFile) {
        console.log('开始获取百度云直链地址');
        let data = new FormData();
        const shorturl = share_res.shorturl;
        data.append('surl', shorturl.substring(shorturl.lastIndexOf('/') + 1, shorturl.length));
        data.append('pwd', pwd);
        data.append('shareid', share_res.shareid);
        data.append('from', uInfo.uk);
        data.append('fsidlist', `[${theFile.fs_id}]`);
        data.append('start', new Date().getTime());
        data.append('code', '9383');
        data.append('u', uInfo.baidu_name);
        data.append('fn', theFile.server_filename);
        data.append('token', '');
        data.append('au', 'https://pic.rmb.bdstatic.com/bjh/faa1661e54ab1bf491bf630fe16f277b.gif');
        let downloadUrl = `${getAppSettingData().getDownloadUrl}?version=${getAppSettingData().scriptVersion}&t=8888` + new Date().getTime();
        downloadUrl = domain + downloadUrl + getAppSettingData().param;
        console.log({ url: downloadUrl, data: data });
        let res = await doRequest({ name: '百度云直链', url: downloadUrl, data: data });
        if (typeof res == 'string') {
            try {
                res = JSON.parse(res.split('}{')[0] + '}')
            } catch (e) {
                console.error('获取百度云直链地址失败 JSON解析错误');
                res = {};
            }
        }
        if (res && res.errno === 0) {
            console.log('结束获取百度云直链地址', res);
            return res
        } else {
            console.error('获取百度云直链地址失败', res);
            throw new Error('获取百度云直链地址失败' + JSON.stringify(res));
        }
    }


    /**
     * 示例:formatTime('yyyy-MM-dd qq HH:mm:ss.S') $.time('yyyyMMddHHmmssS')
     * y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     * 其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param fmt 格式化参数
     * @param ts 根据指定时间戳返回格式化日期
     * @returns
     */
    function formatTime(fmt, ts = null) {
        const date = ts ? new Date(ts) : new Date()
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (let k in o) {
            let item = o[k];
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? item : ('00' + item).substr(('' + item).length))
        }
        return fmt
    }

    //发送至aria2
    async function ariaDownload(response) {
        console.log('开始启用aria2下载资源');
        let path = formatTime('yyyyMMdd');
        let rpcDir = `E:/code/lu.php/live/${path}`;
        let rpcUrl = 'http://localhost:6800/jsonrpc';
        //delete response.aria2info.params[2].dir;
        response.aria2info.params[2]['dir'] = '{{{rpcDir}}}';
        delete response.aria2info.params[2]['max-connection-per-server'];
        delete response.aria2info.params[2].split;
        delete response.aria2info.params[2]['piece-length'];
        let data = JSON.stringify(response.aria2info);
        data = data.replace('{{{rpcDir}}}', rpcDir).replace('{{{rpcToken}}}', '');
        let res = await doRequest({ name: 'Aria2', 'timeout': 3000, url: rpcUrl, data: data });
        if (res.result) {
            console.log('结束启用aria2下载资源', res);
        } else {
            console.error('启用aria2下载资源出错了！', res)
            throw new Error('启用aria2下载资源出错了！' + JSON.stringify(res));
        }
    }
    function htmlLog(msg, type = 'log') {
        let colorMap = { 'log': '#333', 'info': '#198754', 'warn': '#ffc107', 'error': '#dc3545', };
        let color = colorMap[type] ?? '#333';
        let date = formatTime('MM-dd HH:mm:ss');
        console.log(msg);
        $('.nd-detail').append(`<div><span>${date} </span><span style="color:${color}"> ${msg}</span></div>`)
    }

    async function checkAria2() {
        try {
            await doRequest({ name: 'Aria2', 'method': 'get', url: 'http://localhost:6800/jsonrpc', 'timeout': 500 });
        } catch (error) {
            throw new Error('请安装并且启动Aria2软件');
        }
    }

    async function handleFilePool(theFiles, domain, times, tryTimes, limit) {
        let handleFile = async function (theFile, tt) {
            htmlLog(`开始第${tt}次处理文件 《${theFile.server_filename}》...`);
            let vv = parseInt((new Date().getTime() - new Date('2022-08-22').getTime())).toString(36);
            let uInfo = { uk: vv, baidu_name: '救赎——' + vv };// await getUInfo();
            let pwd = getRndPwd(4);
            try {
                let ttt=new Date().getTime();
                let share_res = await doShare(theFile, pwd);
                let ttt1=new Date().getTime();
                let vvv1=ttt1-ttt;
                let res_url = await getRealDownloadUrl(domain, share_res, uInfo, pwd, theFile);
                let ttt2=new Date().getTime();
                let vvv2=ttt2-ttt1;
                await ariaDownload(res_url);
                let ttt3=new Date().getTime();
                let vvv3=ttt3-ttt2;
                theFile.vvv=[vvv1,vvv2,vvv3];
                theFile.status = true;
                theFile.error = '';
            } catch (error) {
                theFile.status = false;
                theFile.error = error;
            }
            return theFile;
        }
        const result = [];
        const executing = [];
        while (theFiles.length) {
            let theFile = theFiles.shift();
            const p = Promise.resolve(handleFile(theFile, times));
            result.push(p);
            if (limit <= theFiles.length) {
                const e = p.then((voFile) => {
                    executing.splice(executing.indexOf(e), 1);
                    if (voFile.status) {
                        htmlLog(`获取文件《${voFile.server_filename}》的直链成功`, 'info')
                    } else {
                        if (times < tryTimes) {
                            htmlLog(`获取文件 《${voFile.server_filename}》的直链异常，正在重新尝试， ${voFile.error}`, 'warn')
                        } else {
                            htmlLog(`获取文件 《${voFile.server_filename}》的直链失败，${voFile.error}`, 'error')
                        }
                    }
                });
                executing.push(e);
                if (executing.length >= limit) {
                    await Promise.race(executing);
                }
            }
        }
        return Promise.all(result);
    }

    async function doHandleFilePool(files, domain, tryTimes = 2, limit = 2) {
        let tt_start=new Date().getTime();
        let theFiles = files; let len = theFiles.length, success = 0;
        for (var i = 0; i < tryTimes; i++) {
            if (theFiles.length === 0) break;
            theFiles = await handleFilePool(theFiles, domain, i + 1, tryTimes, limit);
            //console.log(theFiles);
            theFiles = theFiles.filter((voFile) => {
                if (voFile.status) {
                    success++;
                }
                return !voFile.status;
            });
        }
        let tt_end=new Date().getTime();
        let sss=parseInt((tt_end-tt_start)/1000);
        let mm=parseInt(sss/60);
        let ss=sss-mm*60;
        let msg = `本次处理${len}个文件,成功【${success}】，失败【${len - success}】,用时${mm}分,${ss}秒 请前往aria2查看具体下载情况`;
        htmlLog(msg, 'info');
        showNotice(msg);
    }

    async function run() {
        let fileListArr = getSelectedFileList();
        let tryTimes = 2, limit =2;
        await checkAria2();

        fileListArr = fileListArr.filter((vo) => {
            if (vo.isdir !== 0) {
                htmlLog(`注意目录《${vo.server_filename}》无法下载！`, 'warn');
            }
            return vo.isdir === 0;
        });

        let len = fileListArr.length;
        if (len > 0) {
            htmlLog(`正在处理${len}个文件。。。`);
            console.log(`正在处理${len}个文件`, fileListArr);
            let domain = await getDownloadDomain();
            await doHandleFilePool(fileListArr, domain, tryTimes, limit); 

        } else {
            throw new Error('请选择文件下载');
        }
    }

    function showNotice(text, title = '百度云脚本') {
        GM_notification({
            text: text, title: title, image: 'https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico', onclick: () => {
                console.log('点击通知');
            }
        })
    }

    function main() {
        $('.wp-s-pan-file-main__nav').append($('button[title="新建在线文档"]').parent().html().replace(/新建在线文档/g, 'aria2下载').replace(/u-icon-newly-build/g, 'u-icon-download'));
        $('button[title="aria2下载"]').css('color', '#ff2066');
        $(document).on('click', '[title="aria2下载"]', () => {
            htmlLog('panbaidu 脚本开始！', 'START');
            //$('.nd-detail').html('');
            $('.nd-detail__title').siblings().remove()
            $('[title="aria2下载"]').attr('disabled', true);
            run().catch((err) => {
                htmlLog(`系统错误终止运行，${err}`, 'error')
                showNotice(`下载出错了，请稍后再试，${err}`);
                console.error(err);
            }).finally(() => {
                $('[title="aria2下载"]').attr('disabled', null);
                htmlLog('panbaidu 结束！', 'END');
            });
        });
    }

    main();
})();
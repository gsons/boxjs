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

declare var $: any;


class Baidu {
    async run() {
        console.log('脚本运行开始', 'START');
        this.main().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log('脚本运行结束', 'END');
        });
    }
    async main() {
        $('.nd-detail').append('<div class="htmllog" style="position: absolute;top:0;z-index: 9999;background:#FFF;width: 248px; height: calc(100% - 40px); overflow: auto;"> </div>');
        $('.wp-s-pan-file-main__nav').append($('button[title="新建在线文档"]').prop("outerHTML").replace(/新建在线文档/g, 'aria2下载').replace(/u-icon-newly-build/g, 'u-icon-download'));
        $('button[title="aria2下载"]').css('color', '#ff2066');
    }
}

new Baidu().run();
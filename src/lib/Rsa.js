
"use strict";
var t = {
    appName: "Netscape",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
},
    e = {
        ASN1: null,
        Base64: null,
        Hex: null,
        crypto: null,
        href: null
    },
    i = null;
if (void 0 === r || !r) var r = {};
r.namespace = function () {
    var t, e, i, n = arguments,
        s = null;
    for (t = 0; t < n.length; t += 1)
        for (i = ("" + n[t])
            .split("."), s = r, e = "YAHOO" == i[0] ? 1 : 0; e < i.length; e += 1) s[i[e]] = s[i[e]] || {}, s = s[i[e]];
    return s
}, r.log = function (t, e, i) {
    var n = r.widget.Logger;
    return !(!n || !n.log) && n.log(t, e, i)
}, r.register = function (t, e, i) {
    var n, s, o, a, h, c = r.env.modules;
    for (c[t] || (c[t] = {
        versions: [],
        builds: []
    }), n = c[t], s = i.version, o = i.build, a = r.env.listeners, n.name = t, n.version = s, n.build = o, n.versions.push(s), n.builds.push(o), n.mainClass = e, h = 0; h < a.length; h += 1) a[h](n);
    e ? (e.VERSION = s, e.BUILD = o) : r.log("mainClass is undefined for module " + t, "warn")
}, r.env = r.env || {
    modules: [],
    listeners: []
}, r.env.getVersion = function (t) {
    return r.env.modules[t] || null
}, r.env.parseUA = function (i) {
    var r, n = function (t) {
        var e = 0;
        return parseFloat(t.replace(/\./g, (function () {
            return 1 == e++ ? "" : "."
        })))
    },
        s = {
            ie: 0,
            opera: 0,
            gecko: 0,
            webkit: 0,
            chrome: 0,
            mobile: null,
            air: 0,
            ipad: 0,
            iphone: 0,
            ipod: 0,
            ios: null,
            android: 0,
            webos: 0,
            caja: t && t.cajaVersion,
            secure: !1,
            os: null
        },
        o = i || t && t.userAgent,
        a = e && e.location,
        h = a && a.href;
    return s.secure = h && 0 === h.toLowerCase()
        .indexOf("https"), o && (/windows|win32/i.test(o) ? s.os = "windows" : /macintosh/i.test(o) ? s.os = "macintosh" : /rhino/i.test(o) && (s.os = "rhino"), /KHTML/.test(o) && (s.webkit = 1), (r = o.match(/AppleWebKit\/([^\s]*)/)) && r[1] && (s.webkit = n(r[1]), / Mobile\//.test(o) ? (s.mobile = "Apple", (r = o.match(/OS ([^\s]*)/)) && r[1] && (r = n(r[1].replace("_", "."))), s.ios = r, s.ipad = s.ipod = s.iphone = 0, (r = o.match(/iPad|iPod|iPhone/)) && r[0] && (s[r[0].toLowerCase()] = s.ios)) : ((r = o.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/)) && (s.mobile = r[0]), /webOS/.test(o) && (s.mobile = "WebOS", (r = o.match(/webOS\/([^\s]*);/)) && r[1] && (s.webos = n(r[1]))), / Android/.test(o) && (s.mobile = "Android", (r = o.match(/Android ([^\s]*);/)) && r[1] && (s.android = n(r[1])))), (r = o.match(/Chrome\/([^\s]*)/)) && r[1] ? s.chrome = n(r[1]) : (r = o.match(/AdobeAIR\/([^\s]*)/)) && (s.air = r[0])), s.webkit || ((r = o.match(/Opera[\s\/]([^\s]*)/)) && r[1] ? (s.opera = n(r[1]), (r = o.match(/Version\/([^\s]*)/)) && r[1] && (s.opera = n(r[1])), (r = o.match(/Opera Mini[^;]*/)) && (s.mobile = r[0])) : (r = o.match(/MSIE\s([^;]*)/)) && r[1] ? s.ie = n(r[1]) : (r = o.match(/Gecko\/([^\s]*)/)) && (s.gecko = 1, (r = o.match(/rv:([^\s\)]*)/)) && r[1] && (s.gecko = n(r[1]))))), s
}, r.env.ua = r.env.parseUA(), r.register("yahoo", r, {
    version: "2.9.0",
    build: "2800"
});
var n, s, o, a, h, c, u, f, p, d, l, g = g || (n = Math, o = (s = {})
    .lib = {}, a = o.Base = function () {
        function t() { }
        return {
            extend: function (e) {
                t.prototype = this;
                var i = new t;
                return e && i.mixIn(e), i.hasOwnProperty("init") || (i.init = function () {
                    i.$super.init.apply(this, arguments)
                }), i.init.prototype = i, i.$super = this, i
            },
            create: function () {
                var t = this.extend();
                return t.init.apply(t, arguments), t
            },
            init: function () { },
            mixIn: function (t) {
                for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
                t.hasOwnProperty("toString") && (this.toString = t.toString)
            },
            clone: function () {
                return this.init.prototype.extend(this)
            }
        }
    }(), h = o.WordArray = a.extend({
        init: function (t, e) {
            t = this.words = t || [], this.sigBytes = null != e ? e : 4 * t.length
        },
        toString: function (t) {
            return (t || u)
                .stringify(this)
        },
        concat: function (t) {
            var e = this.words,
                i = t.words,
                r = this.sigBytes,
                n = t.sigBytes;
            if (this.clamp(), r % 4)
                for (var s = 0; s < n; s++) {
                    var o = i[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                    e[r + s >>> 2] |= o << 24 - (r + s) % 4 * 8
                } else
                for (s = 0; s < n; s += 4) e[r + s >>> 2] = i[s >>> 2];
            return this.sigBytes += n, this
        },
        clamp: function () {
            var t = this.words,
                e = this.sigBytes;
            t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8, t.length = n.ceil(e / 4)
        },
        clone: function () {
            var t = a.clone.call(this);
            return t.words = this.words.slice(0), t
        },
        random: function (t) {
            for (var e = [], i = 0; i < t; i += 4) e.push(4294967296 * n.random() | 0);
            return new h.init(e, t)
        }
    }), c = s.enc = {}, u = c.Hex = {
        stringify: function (t) {
            for (var e = t.words, i = t.sigBytes, r = [], n = 0; n < i; n++) {
                var s = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                r.push((s >>> 4)
                    .toString(16)), r.push((15 & s)
                        .toString(16))
            }
            return r.join("")
        },
        parse: function (t) {
            for (var e = t.length, i = [], r = 0; r < e; r += 2) i[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;
            return new h.init(i, e / 2)
        }
    }, f = c.Latin1 = {
        stringify: function (t) {
            for (var e = t.words, i = t.sigBytes, r = [], n = 0; n < i; n++) {
                var s = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                r.push(String.fromCharCode(s))
            }
            return r.join("")
        },
        parse: function (t) {
            for (var e = t.length, i = [], r = 0; r < e; r++) i[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;
            return new h.init(i, e)
        }
    }, p = c.Utf8 = {
        stringify: function (t) {
            try {
                return decodeURIComponent(escape(f.stringify(t)))
            } catch (t) {
                throw new Error("Malformed UTF-8 data")
            }
        },
        parse: function (t) {
            return f.parse(unescape(encodeURIComponent(t)))
        }
    }, d = o.BufferedBlockAlgorithm = a.extend({
        reset: function () {
            this._data = new h.init, this._nDataBytes = 0
        },
        _append: function (t) {
            "string" == typeof t && (t = p.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes
        },
        _process: function (t) {
            var e = this._data,
                i = e.words,
                r = e.sigBytes,
                s = this.blockSize,
                o = r / (4 * s),
                a = (o = t ? n.ceil(o) : n.max((0 | o) - this._minBufferSize, 0)) * s,
                c = n.min(4 * a, r);
            if (a) {
                for (var u = 0; u < a; u += s) this._doProcessBlock(i, u);
                var f = i.splice(0, a);
                e.sigBytes -= c
            }
            return new h.init(f, c)
        },
        clone: function () {
            var t = a.clone.call(this);
            return t._data = this._data.clone(), t
        },
        _minBufferSize: 0
    }), o.Hasher = d.extend({
        cfg: a.extend(),
        init: function (t) {
            this.cfg = this.cfg.extend(t), this.reset()
        },
        reset: function () {
            d.reset.call(this), this._doReset()
        },
        update: function (t) {
            return this._append(t), this._process(), this
        },
        finalize: function (t) {
            return t && this._append(t), this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function (t) {
            return function (e, i) {
                return new t.init(i)
                    .finalize(e)
            }
        },
        _createHmacHelper: function (t) {
            return function (e, i) {
                return new l.HMAC.init(t, i)
                    .finalize(e)
            }
        }
    }), l = s.algo = {}, s);
! function (t) {
    var e, i = (e = g)
        .lib,
        r = i.Base,
        n = i.WordArray;
    (e = e.x64 = {})
        .Word = r.extend({
            init: function (t, e) {
                this.high = t, this.low = e
            }
        }), e.WordArray = r.extend({
            init: function (t, e) {
                t = this.words = t || [], this.sigBytes = null != e ? e : 8 * t.length
            },
            toX32: function () {
                for (var t = this.words, e = t.length, i = [], r = 0; r < e; r++) {
                    var s = t[r];
                    i.push(s.high), i.push(s.low)
                }
                return n.create(i, this.sigBytes)
            },
            clone: function () {
                for (var t = r.clone.call(this), e = t.words = this.words.slice(0), i = e.length, n = 0; n < i; n++) e[n] = e[n].clone();
                return t
            }
        })
}(), g.lib.Cipher || function (t) {
    var e = (d = g)
        .lib,
        i = e.Base,
        r = e.WordArray,
        n = e.BufferedBlockAlgorithm,
        s = d.enc.Base64,
        o = d.algo.EvpKDF,
        a = e.Cipher = n.extend({
            cfg: i.extend(),
            createEncryptor: function (t, e) {
                return this.create(this._ENC_XFORM_MODE, t, e)
            },
            createDecryptor: function (t, e) {
                return this.create(this._DEC_XFORM_MODE, t, e)
            },
            init: function (t, e, i) {
                this.cfg = this.cfg.extend(i), this._xformMode = t, this._key = e, this.reset()
            },
            reset: function () {
                n.reset.call(this), this._doReset()
            },
            process: function (t) {
                return this._append(t), this._process()
            },
            finalize: function (t) {
                return t && this._append(t), this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function (t) {
                return {
                    encrypt: function (e, i, r) {
                        return ("string" == typeof i ? l : p)
                            .encrypt(t, e, i, r)
                    },
                    decrypt: function (e, i, r) {
                        return ("string" == typeof i ? l : p)
                            .decrypt(t, e, i, r)
                    }
                }
            }
        });
    e.StreamCipher = a.extend({
        _doFinalize: function () {
            return this._process(!0)
        },
        blockSize: 1
    });
    var h = d.mode = {},
        c = function (t, e, i) {
            var r = this._iv;
            r ? this._iv = void 0 : r = this._prevBlock;
            for (var n = 0; n < i; n++) t[e + n] ^= r[n]
        },
        u = (e.BlockCipherMode = i.extend({
            createEncryptor: function (t, e) {
                return this.Encryptor.create(t, e)
            },
            createDecryptor: function (t, e) {
                return this.Decryptor.create(t, e)
            },
            init: function (t, e) {
                this._cipher = t, this._iv = e
            }
        }))
            .extend();
    u.Encryptor = u.extend({
        processBlock: function (t, e) {
            var i = this._cipher,
                r = i.blockSize;
            c.call(this, t, e, r), i.encryptBlock(t, e), this._prevBlock = t.slice(e, e + r)
        }
    }), u.Decryptor = u.extend({
        processBlock: function (t, e) {
            var i = this._cipher,
                r = i.blockSize,
                n = t.slice(e, e + r);
            i.decryptBlock(t, e), c.call(this, t, e, r), this._prevBlock = n
        }
    }), h = h.CBC = u, u = (d.pad = {})
        .Pkcs7 = {
        pad: function (t, e) {
            for (var i, n = (i = (i = 4 * e) - t.sigBytes % i) << 24 | i << 16 | i << 8 | i, s = [], o = 0; o < i; o += 4) s.push(n);
            i = r.create(s, i), t.concat(i)
        },
        unpad: function (t) {
            t.sigBytes -= 255 & t.words[t.sigBytes - 1 >>> 2]
        }
    }, e.BlockCipher = a.extend({
        cfg: a.cfg.extend({
            mode: h,
            padding: u
        }),
        reset: function () {
            a.reset.call(this);
            var t = (e = this.cfg)
                .iv,
                e = e.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var i = e.createEncryptor;
            else i = e.createDecryptor, this._minBufferSize = 1;
            this._mode = i.call(e, this, t && t.words)
        },
        _doProcessBlock: function (t, e) {
            this._mode.processBlock(t, e)
        },
        _doFinalize: function () {
            var t = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                t.pad(this._data, this.blockSize);
                var e = this._process(!0)
            } else e = this._process(!0), t.unpad(e);
            return e
        },
        blockSize: 4
    });
    var f = e.CipherParams = i.extend({
        init: function (t) {
            this.mixIn(t)
        },
        toString: function (t) {
            return (t || this.formatter)
                .stringify(this)
        }
    }),
        p = (h = (d.format = {})
            .OpenSSL = {
            stringify: function (t) {
                var e = t.ciphertext;
                return ((t = t.salt) ? r.create([1398893684, 1701076831])
                    .concat(t)
                    .concat(e) : e)
                    .toString(s)
            },
            parse: function (t) {
                var e = (t = s.parse(t))
                    .words;
                if (1398893684 == e[0] && 1701076831 == e[1]) {
                    var i = r.create(e.slice(2, 4));
                    e.splice(0, 4), t.sigBytes -= 16
                }
                return f.create({
                    ciphertext: t,
                    salt: i
                })
            }
        }, e.SerializableCipher = i.extend({
            cfg: i.extend({
                format: h
            }),
            encrypt: function (t, e, i, r) {
                r = this.cfg.extend(r);
                var n = t.createEncryptor(i, r);
                return e = n.finalize(e), n = n.cfg, f.create({
                    ciphertext: e,
                    key: i,
                    iv: n.iv,
                    algorithm: t,
                    mode: n.mode,
                    padding: n.padding,
                    blockSize: t.blockSize,
                    formatter: r.format
                })
            },
            decrypt: function (t, e, i, r) {
                return r = this.cfg.extend(r), e = this._parse(e, r.format), t.createDecryptor(i, r)
                    .finalize(e.ciphertext)
            },
            _parse: function (t, e) {
                return "string" == typeof t ? e.parse(t, this) : t
            }
        })),
        d = (d.kdf = {})
            .OpenSSL = {
            execute: function (t, e, i, n) {
                return n || (n = r.random(8)), t = o.create({
                    keySize: e + i
                })
                    .compute(t, n), i = r.create(t.words.slice(e), 4 * i), t.sigBytes = 4 * e, f.create({
                        key: t,
                        iv: i,
                        salt: n
                    })
            }
        },
        l = e.PasswordBasedCipher = p.extend({
            cfg: p.cfg.extend({
                kdf: d
            }),
            encrypt: function (t, e, i, r) {
                return i = (r = this.cfg.extend(r))
                    .kdf.execute(i, t.keySize, t.ivSize), r.iv = i.iv, (t = p.encrypt.call(this, t, e, i.key, r))
                        .mixIn(i), t
            },
            decrypt: function (t, e, i, r) {
                return r = this.cfg.extend(r), e = this._parse(e, r.format), i = r.kdf.execute(i, t.keySize, t.ivSize, e.salt), r.iv = i.iv, p.decrypt.call(this, t, e, i.key, r)
            }
        })
}(),
    function (t) {
        for (var e = g, i = (n = e.lib)
            .WordArray, r = n.Hasher, n = e.algo, s = [], o = [], a = function (t) {
                return 4294967296 * (t - (0 | t)) | 0
            }, h = 2, c = 0; 64 > c;) {
            var u;
            t: {
                u = h;
                for (var f = t.sqrt(u), p = 2; p <= f; p++)
                    if (!(u % p)) {
                        u = !1;
                        break t
                    } u = !0
            }
            u && (8 > c && (s[c] = a(t.pow(h, .5))), o[c] = a(t.pow(h, 1 / 3)), c++), h++
        }
        var d = [];
        n = n.SHA256 = r.extend({
            _doReset: function () {
                this._hash = new i.init(s.slice(0))
            },
            _doProcessBlock: function (t, e) {
                for (var i = this._hash.words, r = i[0], n = i[1], s = i[2], a = i[3], h = i[4], c = i[5], u = i[6], f = i[7], p = 0; 64 > p; p++) {
                    if (16 > p) d[p] = 0 | t[e + p];
                    else {
                        var l = d[p - 15],
                            g = d[p - 2];
                        d[p] = ((l << 25 | l >>> 7) ^ (l << 14 | l >>> 18) ^ l >>> 3) + d[p - 7] + ((g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10) + d[p - 16]
                    }
                    l = f + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & c ^ ~h & u) + o[p] + d[p], g = ((r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22)) + (r & n ^ r & s ^ n & s), f = u, u = c, c = h, h = a + l | 0, a = s, s = n, n = r, r = l + g | 0
                }
                i[0] = i[0] + r | 0, i[1] = i[1] + n | 0, i[2] = i[2] + s | 0, i[3] = i[3] + a | 0, i[4] = i[4] + h | 0, i[5] = i[5] + c | 0, i[6] = i[6] + u | 0, i[7] = i[7] + f | 0
            },
            _doFinalize: function () {
                var e = this._data,
                    i = e.words,
                    r = 8 * this._nDataBytes,
                    n = 8 * e.sigBytes;
                return i[n >>> 5] |= 128 << 24 - n % 32, i[14 + (n + 64 >>> 9 << 4)] = t.floor(r / 4294967296), i[15 + (n + 64 >>> 9 << 4)] = r, e.sigBytes = 4 * i.length, this._process(), this._hash
            },
            clone: function () {
                var t = r.clone.call(this);
                return t._hash = this._hash.clone(), t
            }
        }), e.SHA256 = r._createHelper(n), e.HmacSHA256 = r._createHmacHelper(n)
    }(Math);
var v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function y(t) {
    var e, i, r, n = "",
        s = 0;
    for (e = 0; e < t.length && "=" != t.charAt(e); ++e)(r = v.indexOf(t.charAt(e))) < 0 || (0 == s ? (n += O(r >> 2), i = 3 & r, s = 1) : 1 == s ? (n += O(i << 2 | r >> 4), i = 15 & r, s = 2) : 2 == s ? (n += O(i), n += O(r >> 2), i = 3 & r, s = 3) : (n += O(i << 2 | r >> 4), n += O(15 & r), s = 0));
    return 1 == s && (n += O(i << 2)), n
}

function b(t, e, i) {
    null != t && ("number" == typeof t ? this.fromNumber(t, e, i) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
}

function S() {
    return new b(null)
}
b.prototype.am = function (t, e, i, r, n, s) {
    for (var o = 16383 & e, a = e >> 14; --s >= 0;) {
        var h = 16383 & this[t],
            c = this[t++] >> 14,
            u = a * h + c * o;
        n = ((h = o * h + ((16383 & u) << 14) + i[r] + n) >> 28) + (u >> 14) + a * c, i[r++] = 268435455 & h
    }
    return n
}, b.prototype.DB = 28, b.prototype.DM = 268435455, b.prototype.DV = 1 << 28;
b.prototype.FV = Math.pow(2, 52), b.prototype.F1 = 24, b.prototype.F2 = 4;
var m, A, x = new Array;
for (m = "0".charCodeAt(0), A = 0; A <= 9; ++A) x[m++] = A;
for (m = "a".charCodeAt(0), A = 10; A < 36; ++A) x[m++] = A;
for (m = "A".charCodeAt(0), A = 10; A < 36; ++A) x[m++] = A;

function O(t) {
    return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)
}

function E(t, e) {
    var i = x[t.charCodeAt(e)];
    return null == i ? -1 : i
}

function D(t) {
    var e = S();
    return e.fromInt(t), e
}

function w(t) {
    var e, i = 1;
    return 0 != (e = t >>> 16) && (t = e, i += 16), 0 != (e = t >> 8) && (t = e, i += 8), 0 != (e = t >> 4) && (t = e, i += 4), 0 != (e = t >> 2) && (t = e, i += 2), 0 != (e = t >> 1) && (t = e, i += 1), i
}

function _(t) {
    this.m = t
}

function P(t) {
    this.m = t, this.mp = t.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t
}

function H(t, e) {
    return new b(t, e)
}

function j() {
    this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
}
P.prototype.convert = function (t) {
    var e = S();
    return t.abs()
        .dlShiftTo(this.m.t, e), e.divRemTo(this.m, null, e), t.s < 0 && e.compareTo(b.ZERO) > 0 && this.m.subTo(e, e), e
}, P.prototype.revert = function (t) {
    var e = S();
    return t.copyTo(e), this.reduce(e), e
}, P.prototype.reduce = function (t) {
    for (; t.t <= this.mt2;) t[t.t++] = 0;
    for (var e = 0; e < this.m.t; ++e) {
        var i = 32767 & t[e],
            r = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
        for (t[i = e + this.m.t] += this.m.am(0, r, t, e, 0, this.m.t); t[i] >= t.DV;) t[i] -= t.DV, t[++i]++
    }
    t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
}, P.prototype.mulTo = function (t, e, i) {
    t.multiplyTo(e, i), this.reduce(i)
}, P.prototype.sqrTo = function (t, e) {
    t.squareTo(e), this.reduce(e)
}, b.prototype.copyTo = function (t) {
    for (var e = this.t - 1; e >= 0; --e) t[e] = this[e];
    t.t = this.t, t.s = this.s
}, b.prototype.fromInt = function (t) {
    this.t = 1, this.s = t < 0 ? -1 : 0, t > 0 ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0
}, b.prototype.fromString = function (t, e) {
    var i;
    if (16 == e) i = 4;
    else if (8 == e) i = 3;
    else if (256 == e) i = 8;
    else if (2 == e) i = 1;
    else if (32 == e) i = 5;
    else {
        if (4 != e) return void this.fromRadix(t, e);
        i = 2
    }
    this.t = 0, this.s = 0;
    for (var r = t.length, n = !1, s = 0; --r >= 0;) {
        var o = 8 == i ? 255 & t[r] : E(t, r);
        o < 0 ? "-" == t.charAt(r) && (n = !0) : (n = !1, 0 == s ? this[this.t++] = o : s + i > this.DB ? (this[this.t - 1] |= (o & (1 << this.DB - s) - 1) << s, this[this.t++] = o >> this.DB - s) : this[this.t - 1] |= o << s, (s += i) >= this.DB && (s -= this.DB))
    }
    8 == i && 0 != (128 & t[0]) && (this.s = -1, s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)), this.clamp(), n && b.ZERO.subTo(this, this)
}, b.prototype.clamp = function () {
    for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;) --this.t
}, b.prototype.dlShiftTo = function (t, e) {
    var i;
    for (i = this.t - 1; i >= 0; --i) e[i + t] = this[i];
    for (i = t - 1; i >= 0; --i) e[i] = 0;
    e.t = this.t + t, e.s = this.s
}, b.prototype.drShiftTo = function (t, e) {
    for (var i = t; i < this.t; ++i) e[i - t] = this[i];
    e.t = Math.max(this.t - t, 0), e.s = this.s
}, b.prototype.lShiftTo = function (t, e) {
    var i, r = t % this.DB,
        n = this.DB - r,
        s = (1 << n) - 1,
        o = Math.floor(t / this.DB),
        a = this.s << r & this.DM;
    for (i = this.t - 1; i >= 0; --i) e[i + o + 1] = this[i] >> n | a, a = (this[i] & s) << r;
    for (i = o - 1; i >= 0; --i) e[i] = 0;
    e[o] = a, e.t = this.t + o + 1, e.s = this.s, e.clamp()
}, b.prototype.rShiftTo = function (t, e) {
    e.s = this.s;
    var i = Math.floor(t / this.DB);
    if (i >= this.t) e.t = 0;
    else {
        var r = t % this.DB,
            n = this.DB - r,
            s = (1 << r) - 1;
        e[0] = this[i] >> r;
        for (var o = i + 1; o < this.t; ++o) e[o - i - 1] |= (this[o] & s) << n, e[o - i] = this[o] >> r;
        r > 0 && (e[this.t - i - 1] |= (this.s & s) << n), e.t = this.t - i, e.clamp()
    }
}, b.prototype.subTo = function (t, e) {
    for (var i = 0, r = 0, n = Math.min(t.t, this.t); i < n;) r += this[i] - t[i], e[i++] = r & this.DM, r >>= this.DB;
    if (t.t < this.t) {
        for (r -= t.s; i < this.t;) r += this[i], e[i++] = r & this.DM, r >>= this.DB;
        r += this.s
    } else {
        for (r += this.s; i < t.t;) r -= t[i], e[i++] = r & this.DM, r >>= this.DB;
        r -= t.s
    }
    e.s = r < 0 ? -1 : 0, r < -1 ? e[i++] = this.DV + r : r > 0 && (e[i++] = r), e.t = i, e.clamp()
}, b.prototype.multiplyTo = function (t, e) {
    var i = this.abs(),
        r = t.abs(),
        n = i.t;
    for (e.t = n + r.t; --n >= 0;) e[n] = 0;
    for (n = 0; n < r.t; ++n) e[n + i.t] = i.am(0, r[n], e, n, 0, i.t);
    e.s = 0, e.clamp(), this.s != t.s && b.ZERO.subTo(e, e)
}, b.prototype.squareTo = function (t) {
    for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0;) t[i] = 0;
    for (i = 0; i < e.t - 1; ++i) {
        var r = e.am(i, e[i], t, 2 * i, 0, 1);
        (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, r, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV, t[i + e.t + 1] = 1)
    }
    t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)), t.s = 0, t.clamp()
}, b.prototype.divRemTo = function (t, e, i) {
    var r = t.abs();
    if (!(r.t <= 0)) {
        var n = this.abs();
        if (n.t < r.t) return null != e && e.fromInt(0), void (null != i && this.copyTo(i));
        null == i && (i = S());
        var s = S(),
            o = this.s,
            a = t.s,
            h = this.DB - w(r[r.t - 1]);
        h > 0 ? (r.lShiftTo(h, s), n.lShiftTo(h, i)) : (r.copyTo(s), n.copyTo(i));
        var c = s.t,
            u = s[c - 1];
        if (0 != u) {
            var f = u * (1 << this.F1) + (c > 1 ? s[c - 2] >> this.F2 : 0),
                p = this.FV / f,
                d = (1 << this.F1) / f,
                l = 1 << this.F2,
                g = i.t,
                v = g - c,
                y = null == e ? S() : e;
            for (s.dlShiftTo(v, y), i.compareTo(y) >= 0 && (i[i.t++] = 1, i.subTo(y, i)), b.ONE.dlShiftTo(c, y), y.subTo(s, s); s.t < c;) s[s.t++] = 0;
            for (; --v >= 0;) {
                var m = i[--g] == u ? this.DM : Math.floor(i[g] * p + (i[g - 1] + l) * d);
                if ((i[g] += s.am(0, m, i, v, 0, c)) < m)
                    for (s.dlShiftTo(v, y), i.subTo(y, i); i[g] < --m;) i.subTo(y, i)
            }
            null != e && (i.drShiftTo(c, e), o != a && b.ZERO.subTo(e, e)), i.t = c, i.clamp(), h > 0 && i.rShiftTo(h, i), o < 0 && b.ZERO.subTo(i, i)
        }
    }
}, b.prototype.invDigit = function () {
    if (this.t < 1) return 0;
    var t = this[0];
    if (0 == (1 & t)) return 0;
    var e = 3 & t;
    return (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) > 0 ? this.DV - e : -e
}, b.prototype.isEven = function () {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}, b.prototype.exp = function (t, e) {
    if (t > 4294967295 || t < 1) return b.ONE;
    var i = S(),
        r = S(),
        n = e.convert(this),
        s = w(t) - 1;
    for (n.copyTo(i); --s >= 0;)
        if (e.sqrTo(i, r), (t & 1 << s) > 0) e.mulTo(r, n, i);
        else {
            var o = i;
            i = r, r = o
        } return e.revert(i)
}, b.prototype.toString = function (t) {
    if (this.s < 0) return "-" + this.negate()
        .toString(t);
    var e;
    if (16 == t) e = 4;
    else if (8 == t) e = 3;
    else if (2 == t) e = 1;
    else if (32 == t) e = 5;
    else {
        if (4 != t) return this.toRadix(t);
        e = 2
    }
    var i, r = (1 << e) - 1,
        n = !1,
        s = "",
        o = this.t,
        a = this.DB - o * this.DB % e;
    if (o-- > 0)
        for (a < this.DB && (i = this[o] >> a) > 0 && (n = !0, s = O(i)); o >= 0;) a < e ? (i = (this[o] & (1 << a) - 1) << e - a, i |= this[--o] >> (a += this.DB - e)) : (i = this[o] >> (a -= e) & r, a <= 0 && (a += this.DB, --o)), i > 0 && (n = !0), n && (s += O(i));
    return n ? s : "0"
}, b.prototype.negate = function () {
    var t = S();
    return b.ZERO.subTo(this, t), t
}, b.prototype.abs = function () {
    return this.s < 0 ? this.negate() : this
}, b.prototype.compareTo = function (t) {
    var e = this.s - t.s;
    if (0 != e) return e;
    var i = this.t;
    if (0 != (e = i - t.t)) return this.s < 0 ? -e : e;
    for (; --i >= 0;)
        if (0 != (e = this[i] - t[i])) return e;
    return 0
}, b.prototype.bitLength = function () {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + w(this[this.t - 1] ^ this.s & this.DM)
}, b.prototype.mod = function (t) {
    var e = S();
    return this.abs()
        .divRemTo(t, null, e), this.s < 0 && e.compareTo(b.ZERO) > 0 && t.subTo(e, e), e
}, b.prototype.modPowInt = function (t, e) {
    var i;
    return i = t < 256 || e.isEven() ? new _(e) : new P(e), this.exp(t, i)
}, b.ZERO = D(0), b.ONE = D(1), b.prototype.intValue = function () {
    if (this.s < 0) {
        if (1 == this.t) return this[0] - this.DV;
        if (0 == this.t) return -1
    } else {
        if (1 == this.t) return this[0];
        if (0 == this.t) return 0
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}, j.prototype.doPublic = function (t) {
    return t.modPowInt(this.e, this.n)
}, j.prototype.setPublic = function (t, e) {
    if (this.isPublic = !0, this.isPrivate = !1, "string" != typeof t) this.n = t, this.e = e;
    else {
        if (!(null != t && null != e && t.length > 0 && e.length > 0)) throw "Invalid RSA public key";
        this.n = H(t, 16), this.e = parseInt(e, 16)
    }
}, j.prototype.type = "RSA";
var T = new function () { };
T.getByteLengthOfL_AtObj = function (t, e) {
    if ("8" != t.substring(e + 2, e + 3)) return 1;
    var i = parseInt(t.substring(e + 3, e + 4));
    return 0 == i ? -1 : 0 < i && i < 10 ? i + 1 : -2
}, T.getHexOfL_AtObj = function (t, e) {
    var i = T.getByteLengthOfL_AtObj(t, e);
    return i < 1 ? "" : t.substring(e + 2, e + 2 + 2 * i)
}, T.getIntOfL_AtObj = function (t, e) {
    var i = T.getHexOfL_AtObj(t, e);
    return "" == i ? -1 : (parseInt(i.substring(0, 1)) < 8 ? new b(i, 16) : new b(i.substring(2), 16))
        .intValue()
}, T.getStartPosOfV_AtObj = function (t, e) {
    var i = T.getByteLengthOfL_AtObj(t, e);
    return i < 0 ? i : e + 2 * (i + 1)
}, T.getHexOfV_AtObj = function (t, e) {
    var i = T.getStartPosOfV_AtObj(t, e),
        r = T.getIntOfL_AtObj(t, e);
    return t.substring(i, i + 2 * r)
}, T.getHexOfTLV_AtObj = function (t, e) {
    return t.substr(e, 2) + T.getHexOfL_AtObj(t, e) + T.getHexOfV_AtObj(t, e)
}, T.getPosOfNextSibling_AtObj = function (t, e) {
    return T.getStartPosOfV_AtObj(t, e) + 2 * T.getIntOfL_AtObj(t, e)
}, T.getPosArrayOfChildren_AtObj = function (t, e) {
    var i = new Array,
        r = T.getStartPosOfV_AtObj(t, e);
    "03" == t.substr(e, 2) ? i.push(r + 2) : i.push(r);
    for (var n = T.getIntOfL_AtObj(t, e), s = r, o = 0; ;) {
        var a = T.getPosOfNextSibling_AtObj(t, s);
        if (null == a || a - r >= 2 * n) break;
        if (o >= 200) break;
        i.push(a), s = a, o++
    }
    return i
}, T.getDecendantIndexByNthList = function (t, e, i) {
    if (0 == i.length) return e;
    var r = i.shift(),
        n = T.getPosArrayOfChildren_AtObj(t, e);
    return T.getDecendantIndexByNthList(t, n[r], i)
}, T.getDecendantHexTLVByNthList = function (t, e, i) {
    var r = T.getDecendantIndexByNthList(t, e, i);
    return T.getHexOfTLV_AtObj(t, r)
}, T.getVbyList = function (t, e, i, r) {
    var n = T.getDecendantIndexByNthList(t, e, i);
    if (void 0 === n) throw "can't find nthList object";
    if (void 0 !== r && t.substr(n, 2) != r) throw "checking tag doesn't match: " + t.substr(n, 2) + "!=" + r;
    return T.getHexOfV_AtObj(t, n)
}, T.dump = function (t, e, r, n) {
    var s = t;
    t instanceof i.asn1.ASN1Object && (s = t.getEncodedHex());
    var o = function (t, e) {
        return t.length <= 2 * e ? t : t.substr(0, e) + "..(total " + t.length / 2 + "bytes).." + t.substr(t.length - e, e)
    };
    void 0 === e && (e = {
        ommit_long_octet: 32
    }), void 0 === r && (r = 0), void 0 === n && (n = "");
    var a = e.ommit_long_octet;
    if ("01" == s.substr(r, 2)) return "00" == (h = T.getHexOfV_AtObj(s, r)) ? n + "BOOLEAN FALSE\n" : n + "BOOLEAN TRUE\n";
    if ("02" == s.substr(r, 2)) return n + "INTEGER " + o(h = T.getHexOfV_AtObj(s, r), a) + "\n";
    if ("03" == s.substr(r, 2)) return n + "BITSTRING " + o(h = T.getHexOfV_AtObj(s, r), a) + "\n";
    if ("04" == s.substr(r, 2)) {
        var h = T.getHexOfV_AtObj(s, r);
        return T.isASN1HEX(h) ? (m = n + "OCTETSTRING, encapsulates\n") + T.dump(h, e, 0, n + "  ") : n + "OCTETSTRING " + o(h, a) + "\n"
    }
    if ("05" == s.substr(r, 2)) return n + "NULL\n";
    if ("06" == s.substr(r, 2)) {
        var c = T.getHexOfV_AtObj(s, r),
            u = i.asn1.ASN1Util.oidHexToInt(c),
            f = i.asn1.x509.OID.oid2name(u),
            p = u.replace(/\./g, " ");
        return "" != f ? n + "ObjectIdentifier " + f + " (" + p + ")\n" : n + "ObjectIdentifier (" + p + ")\n"
    }
    if ("0c" == s.substr(r, 2)) return n + "UTF8String '" + hextoutf8(T.getHexOfV_AtObj(s, r)) + "'\n";
    if ("13" == s.substr(r, 2)) return n + "PrintableString '" + hextoutf8(T.getHexOfV_AtObj(s, r)) + "'\n";
    if ("14" == s.substr(r, 2)) return n + "TeletexString '" + hextoutf8(T.getHexOfV_AtObj(s, r)) + "'\n";
    if ("16" == s.substr(r, 2)) return n + "IA5String '" + hextoutf8(T.getHexOfV_AtObj(s, r)) + "'\n";
    if ("17" == s.substr(r, 2)) return n + "UTCTime " + hextoutf8(T.getHexOfV_AtObj(s, r)) + "\n";
    if ("18" == s.substr(r, 2)) return n + "GeneralizedTime " + hextoutf8(T.getHexOfV_AtObj(s, r)) + "\n";
    if ("30" == s.substr(r, 2)) {
        if ("3000" == s.substr(r, 4)) return n + "SEQUENCE {}\n";
        m = n + "SEQUENCE\n";
        var d = e;
        if ((2 == (y = T.getPosArrayOfChildren_AtObj(s, r))
            .length || 3 == y.length) && "06" == s.substr(y[0], 2) && "04" == s.substr(y[y.length - 1], 2)) {
            var l = T.getHexOfV_AtObj(s, y[0]),
                g = (u = i.asn1.ASN1Util.oidHexToInt(l), f = i.asn1.x509.OID.oid2name(u), JSON.parse(JSON.stringify(e)));
            g.x509ExtName = f, d = g
        }
        for (var v = 0; v < y.length; v++) m += T.dump(s, d, y[v], n + "  ");
        return m
    }
    if ("31" == s.substr(r, 2)) {
        m = n + "SET\n";
        var y = T.getPosArrayOfChildren_AtObj(s, r);
        for (v = 0; v < y.length; v++) m += T.dump(s, e, y[v], n + "  ");
        return m
    }
    var b = parseInt(s.substr(r, 2), 16);
    if (0 != (128 & b)) {
        var S = 31 & b;
        if (0 != (32 & b)) {
            var m = n + "[" + S + "]\n";
            for (y = T.getPosArrayOfChildren_AtObj(s, r), v = 0; v < y.length; v++) m += T.dump(s, e, y[v], n + "  ");
            return m
        }
        return "68747470" == (h = T.getHexOfV_AtObj(s, r))
            .substr(0, 8) && (h = hextoutf8(h)), "subjectAltName" === e.x509ExtName && 2 == S && (h = hextoutf8(h)), n + "[" + S + "] " + h + "\n"
    }
    return n + "UNKNOWN(" + s.substr(r, 2) + ") " + T.getHexOfV_AtObj(s, r) + "\n"
}, T.isASN1HEX = function (t) {
    if (t.length % 2 == 1) return !1;
    var e = T.getIntOfL_AtObj(t, 0),
        i = t.substr(0, 2),
        r = T.getHexOfL_AtObj(t, 0);
    return t.length - i.length - r.length == 2 * e
}, T.pemToHex = function (t, e) {
    if (-1 == t.indexOf("-----BEGIN ")) throw "can't find PEM header: " + e;
    return y((t = void 0 !== e ? (t = t.replace("-----BEGIN " + e + "-----", ""))
        .replace("-----END " + e + "-----", "") : (t = t.replace(/-----BEGIN [^-]+-----/, ""))
            .replace(/-----END [^-]+-----/, ""))
        .replace(/\s+/g, ""))
}, void 0 !== i && i || (i = {}), void 0 !== i.crypto && i.crypto || (i.crypto = {}), i.crypto.Util = new function () {
    this.DIGESTINFOHEAD = {
        sha1: "3021300906052b0e03021a05000414",
        sha224: "302d300d06096086480165030402040500041c",
        sha256: "3031300d060960864801650304020105000420",
        sha384: "3041300d060960864801650304020205000430",
        sha512: "3051300d060960864801650304020305000440",
        md2: "3020300c06082a864886f70d020205000410",
        md5: "3020300c06082a864886f70d020505000410",
        ripemd160: "3021300906052b2403020105000414"
    }, this.DEFAULTPROVIDER = {
        md5: "cryptojs",
        sha1: "cryptojs",
        sha224: "cryptojs",
        sha256: "cryptojs",
        sha384: "cryptojs",
        sha512: "cryptojs",
        ripemd160: "cryptojs",
        hmacmd5: "cryptojs",
        hmacsha1: "cryptojs",
        hmacsha224: "cryptojs",
        hmacsha256: "cryptojs",
        hmacsha384: "cryptojs",
        hmacsha512: "cryptojs",
        hmacripemd160: "cryptojs",
        MD5withRSA: "cryptojs/jsrsa",
        SHA1withRSA: "cryptojs/jsrsa",
        SHA224withRSA: "cryptojs/jsrsa",
        SHA256withRSA: "cryptojs/jsrsa",
        SHA384withRSA: "cryptojs/jsrsa",
        SHA512withRSA: "cryptojs/jsrsa",
        RIPEMD160withRSA: "cryptojs/jsrsa",
        MD5withECDSA: "cryptojs/jsrsa",
        SHA1withECDSA: "cryptojs/jsrsa",
        SHA224withECDSA: "cryptojs/jsrsa",
        SHA256withECDSA: "cryptojs/jsrsa",
        SHA384withECDSA: "cryptojs/jsrsa",
        SHA512withECDSA: "cryptojs/jsrsa",
        RIPEMD160withECDSA: "cryptojs/jsrsa",
        SHA1withDSA: "cryptojs/jsrsa",
        SHA224withDSA: "cryptojs/jsrsa",
        SHA256withDSA: "cryptojs/jsrsa",
        MD5withRSAandMGF1: "cryptojs/jsrsa",
        SHA1withRSAandMGF1: "cryptojs/jsrsa",
        SHA224withRSAandMGF1: "cryptojs/jsrsa",
        SHA256withRSAandMGF1: "cryptojs/jsrsa",
        SHA384withRSAandMGF1: "cryptojs/jsrsa",
        SHA512withRSAandMGF1: "cryptojs/jsrsa",
        RIPEMD160withRSAandMGF1: "cryptojs/jsrsa"
    }, this.CRYPTOJSMESSAGEDIGESTNAME = {
        md5: g.algo.MD5,
        sha1: g.algo.SHA1,
        sha224: g.algo.SHA224,
        sha256: g.algo.SHA256,
        sha384: g.algo.SHA384,
        ripemd160: g.algo.RIPEMD160
    }, this.hashString = function (t, e) {
        return new i.crypto.MessageDigest({
            alg: e
        })
            .digestString(t)
    }, this.sha256 = function (t) {
        return new i.crypto.MessageDigest({
            alg: "sha256",
            prov: "cryptojs"
        })
            .digestString(t)
    }
}, i.crypto.MessageDigest = function (t) {
    this.setAlgAndProvider = function (t, e) {
        if (null !== (t = i.crypto.MessageDigest.getCanonicalAlgName(t)) && void 0 === e && (e = i.crypto.Util.DEFAULTPROVIDER[t]), -1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(t) && "cryptojs" == e) {
            try {
                this.md = i.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[t].create()
            } catch (e) {
                throw "setAlgAndProvider hash alg set fail alg=" + t + "/" + e
            }
            this.updateString = function (t) {
                this.md.update(t)
            }, this.updateHex = function (t) {
                var e = g.enc.Hex.parse(t);
                this.md.update(e)
            }, this.digest = function () {
                return this.md.finalize()
                    .toString(g.enc.Hex)
            }, this.digestString = function (t) {
                return this.updateString(t), this.digest()
            }, this.digestHex = function (t) {
                return this.updateHex(t), this.digest()
            }
        }
        if (-1 != ":sha256:".indexOf(t) && "sjcl" == e) {
            try {
                this.md = new sjcl.hash.sha256
            } catch (e) {
                throw "setAlgAndProvider hash alg set fail alg=" + t + "/" + e
            }
            this.updateString = function (t) {
                this.md.update(t)
            }, this.updateHex = function (t) {
                var e = sjcl.codec.hex.toBits(t);
                this.md.update(e)
            }, this.digest = function () {
                var t = this.md.finalize();
                return sjcl.codec.hex.fromBits(t)
            }, this.digestString = function (t) {
                return this.updateString(t), this.digest()
            }, this.digestHex = function (t) {
                return this.updateHex(t), this.digest()
            }
        }
    }, this.updateString = function (t) {
        throw "updateString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName
    }, this.updateHex = function (t) {
        throw "updateHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName
    }, this.digest = function () {
        throw "digest() not supported for this alg/prov: " + this.algName + "/" + this.provName
    }, this.digestString = function (t) {
        throw "digestString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName
    }, this.digestHex = function (t) {
        throw "digestHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName
    }, void 0 !== t && void 0 !== t.alg && (this.algName = t.alg, void 0 === t.prov && (this.provName = i.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName, this.provName))
}, i.crypto.MessageDigest.getCanonicalAlgName = function (t) {
    return "string" == typeof t && (t = (t = t.toLowerCase())
        .replace(/-/, "")), t
}, i.crypto.OID = new function () {
    this.oidhex2name = {
        "2a864886f70d010101": "rsaEncryption",
        "2a8648ce3d0201": "ecPublicKey",
        "2a8648ce380401": "dsa",
        "2a8648ce3d030107": "secp256r1",
        "2b8104001f": "secp192k1",
        "2b81040021": "secp224r1",
        "2b8104000a": "secp256k1",
        "2b81040023": "secp521r1",
        "2b81040022": "secp384r1",
        "2a8648ce380403": "SHA1withDSA",
        "608648016503040301": "SHA224withDSA",
        "608648016503040302": "SHA256withDSA"
    }
};
var C = {
    version: "1.0.0",
    getKeyFromPublicPKCS8PEM: function (t) {
        var e = T.pemToHex(t, "PUBLIC KEY");
        return this.getKeyFromPublicPKCS8Hex(e)
    },
    getKeyFromPublicPKCS8Hex: function (t) {
        var e, r = T.getVbyList(t, 0, [0, 0], "06");
        if ("2a864886f70d010101" === r) e = new j;
        else if ("2a8648ce380401" === r) e = new i.crypto.DSA;
        else {
            if ("2a8648ce3d0201" !== r) throw "unsupported PKCS#8 public key hex";
            e = new i.crypto.ECDSA
        }
        return e.readPKCS8PubKeyHex(t), e
    },
    getKey: function (t, e, r) {
        if (void 0 !== j && t instanceof j) return t;
        if (void 0 !== i.crypto.ECDSA && t instanceof i.crypto.ECDSA) return t;
        if (void 0 !== i.crypto.DSA && t instanceof i.crypto.DSA) return t;
        if (void 0 !== t.curve && void 0 !== t.xy && void 0 === t.d) return new i.crypto.ECDSA({
            pub: t.xy,
            curve: t.curve
        });
        if (void 0 !== t.curve && void 0 !== t.d) return new i.crypto.ECDSA({
            prv: t.d,
            curve: t.curve
        });
        if (void 0 === t.kty && void 0 !== t.n && void 0 !== t.e && void 0 === t.d) return (S = new j)
            .setPublic(t.n, t.e), S;
        if (void 0 === t.kty && void 0 !== t.n && void 0 !== t.e && void 0 !== t.d && void 0 !== t.p && void 0 !== t.q && void 0 !== t.dp && void 0 !== t.dq && void 0 !== t.co && void 0 === t.qi) return (S = new j)
            .setPrivateEx(t.n, t.e, t.d, t.p, t.q, t.dp, t.dq, t.co), S;
        if (void 0 === t.kty && void 0 !== t.n && void 0 !== t.e && void 0 !== t.d && void 0 === t.p) return (S = new j)
            .setPrivate(t.n, t.e, t.d), S;
        if (void 0 !== t.p && void 0 !== t.q && void 0 !== t.g && void 0 !== t.y && void 0 === t.x) return (S = new i.crypto.DSA)
            .setPublic(t.p, t.q, t.g, t.y), S;
        if (void 0 !== t.p && void 0 !== t.q && void 0 !== t.g && void 0 !== t.y && void 0 !== t.x) return (S = new i.crypto.DSA)
            .setPrivate(t.p, t.q, t.g, t.y, t.x), S;
        if ("RSA" === t.kty && void 0 !== t.n && void 0 !== t.e && void 0 === t.d) return (S = new j)
            .setPublic(b64utohex(t.n), b64utohex(t.e)), S;
        if ("RSA" === t.kty && void 0 !== t.n && void 0 !== t.e && void 0 !== t.d && void 0 !== t.p && void 0 !== t.q && void 0 !== t.dp && void 0 !== t.dq && void 0 !== t.qi) return (S = new j)
            .setPrivateEx(b64utohex(t.n), b64utohex(t.e), b64utohex(t.d), b64utohex(t.p), b64utohex(t.q), b64utohex(t.dp), b64utohex(t.dq), b64utohex(t.qi)), S;
        if ("RSA" === t.kty && void 0 !== t.n && void 0 !== t.e && void 0 !== t.d) return (S = new j)
            .setPrivate(b64utohex(t.n), b64utohex(t.e), b64utohex(t.d)), S;
        if ("EC" === t.kty && void 0 !== t.crv && void 0 !== t.x && void 0 !== t.y && void 0 === t.d) {
            var n = (v = new i.crypto.ECDSA({
                curve: t.crv
            }))
                .ecparams.keylen / 4,
                s = "04" + ("0000000000" + b64utohex(t.x))
                    .slice(-n) + ("0000000000" + b64utohex(t.y))
                        .slice(-n);
            return v.setPublicKeyHex(s), v
        }
        if ("EC" === t.kty && void 0 !== t.crv && void 0 !== t.x && void 0 !== t.y && void 0 !== t.d) {
            n = (v = new i.crypto.ECDSA({
                curve: t.crv
            }))
                .ecparams.keylen / 4, s = "04" + ("0000000000" + b64utohex(t.x))
                    .slice(-n) + ("0000000000" + b64utohex(t.y))
                        .slice(-n);
            var o = ("0000000000" + b64utohex(t.d))
                .slice(-n);
            return v.setPublicKeyHex(s), v.setPrivateKeyHex(o), v
        }
        if ("pkcs5prv" === r) {
            var a, h = t;
            if (9 === (a = T.getPosArrayOfChildren_AtObj(h, 0))
                .length) (S = new j)
                    .readPrivateKeyFromASN1HexString(t);
            else if (6 === a.length) (S = new i.crypto.DSA)
                .readPKCS5PrvKeyHex(h);
            else {
                if (!(a.length > 2 && "04" === h.substr(a[1], 2))) throw "unsupported PKCS#1/5 hexadecimal key";
                (S = new i.crypto.ECDSA)
                    .readPKCS5PrvKeyHex(h)
            }
            return S
        }
        if ("pkcs8prv" === r) return C.getKeyFromPlainPrivatePKCS8Hex(t);
        if ("pkcs8pub" === r) return C.getKeyFromPublicPKCS8Hex(t);
        if ("x509pub" === r) return X509.getPublicKeyFromCertHex(t);
        if (-1 != t.indexOf("-END CERTIFICATE-", 0) || -1 != t.indexOf("-END X509 CERTIFICATE-", 0) || -1 != t.indexOf("-END TRUSTED CERTIFICATE-", 0)) return X509.getPublicKeyFromCertPEM(t);
        if (-1 != t.indexOf("-END PUBLIC KEY-")) return C.getKeyFromPublicPKCS8PEM(t);
        if (-1 != t.indexOf("-END RSA PRIVATE KEY-") && -1 == t.indexOf("4,ENCRYPTED")) {
            var c = T.pemToHex(t, "RSA PRIVATE KEY");
            return C.getKey(c, null, "pkcs5prv")
        }
        if (-1 != t.indexOf("-END DSA PRIVATE KEY-") && -1 == t.indexOf("4,ENCRYPTED")) {
            var u = T.pemToHex(t, "DSA PRIVATE KEY"),
                f = T.getVbyList(u, 0, [1], "02"),
                p = T.getVbyList(u, 0, [2], "02"),
                d = T.getVbyList(u, 0, [3], "02"),
                l = T.getVbyList(u, 0, [4], "02"),
                g = T.getVbyList(u, 0, [5], "02");
            return (S = new i.crypto.DSA)
                .setPrivate(new b(f, 16), new b(p, 16), new b(d, 16), new b(l, 16), new b(g, 16)), S
        }
        if (-1 != t.indexOf("-END PRIVATE KEY-")) return C.getKeyFromPlainPrivatePKCS8PEM(t);
        if (-1 != t.indexOf("-END RSA PRIVATE KEY-") && -1 != t.indexOf("4,ENCRYPTED")) return C.getRSAKeyFromEncryptedPKCS5PEM(t, e);
        if (-1 != t.indexOf("-END EC PRIVATE KEY-") && -1 != t.indexOf("4,ENCRYPTED")) {
            u = C.getDecryptedKeyHex(t, e);
            var v, y, S = T.getVbyList(u, 0, [1], "04"),
                m = T.getVbyList(u, 0, [2, 0], "06"),
                A = T.getVbyList(u, 0, [3, 0], "03")
                    .substr(2);
            if (void 0 === i.crypto.OID.oidhex2name[m]) throw "undefined OID(hex) in KJUR.crypto.OID: " + m;
            return y = i.crypto.OID.oidhex2name[m], (v = new i.crypto.ECDSA({
                curve: y
            }))
                .setPublicKeyHex(A), v.setPrivateKeyHex(S), v.isPublic = !1, v
        }
        if (-1 != t.indexOf("-END DSA PRIVATE KEY-") && -1 != t.indexOf("4,ENCRYPTED")) return u = C.getDecryptedKeyHex(t, e), f = T.getVbyList(u, 0, [1], "02"), p = T.getVbyList(u, 0, [2], "02"), d = T.getVbyList(u, 0, [3], "02"), l = T.getVbyList(u, 0, [4], "02"), g = T.getVbyList(u, 0, [5], "02"), (S = new i.crypto.DSA)
            .setPrivate(new b(f, 16), new b(p, 16), new b(d, 16), new b(l, 16), new b(g, 16)), S;
        if (-1 != t.indexOf("-END ENCRYPTED PRIVATE KEY-")) return C.getKeyFromEncryptedPKCS8PEM(t, e);
        throw "not supported argument"
    }
};
j.prototype.readPKCS8PrvKeyHex = function (t) {
    var e, i, r, n, s, o, a, h, c = T,
        u = c.getVbyList;
    if (!1 === c.isASN1HEX(t)) throw "not ASN.1 hex string";
    try {
        e = u(t, 0, [2, 0, 1], "02"), i = u(t, 0, [2, 0, 2], "02"), r = u(t, 0, [2, 0, 3], "02"), n = u(t, 0, [2, 0, 4], "02"), s = u(t, 0, [2, 0, 5], "02"), o = u(t, 0, [2, 0, 6], "02"), a = u(t, 0, [2, 0, 7], "02"), h = u(t, 0, [2, 0, 8], "02")
    } catch (t) {
        throw "malformed PKCS#8 plain RSA private key"
    }
    this.setPrivateEx(e, i, r, n, s, o, a, h)
}, j.prototype.readPKCS5PubKeyHex = function (t) {
    if (!1 === T.isASN1HEX(t)) throw "keyHex is not ASN.1 hex string";
    var e = T.getPosArrayOfChildren_AtObj(t, 0);
    if (2 !== e.length || "02" !== t.substr(e[0], 2) || "02" !== t.substr(e[1], 2)) throw "wrong hex for PKCS#5 public key";
    var i = T.getHexOfV_AtObj(t, e[0]),
        r = T.getHexOfV_AtObj(t, e[1]);
    this.setPublic(i, r)
}, j.prototype.readPKCS8PubKeyHex = function (t) {
    if (!1 === T.isASN1HEX(t)) throw "not ASN.1 hex string";
    if ("06092a864886f70d010101" !== T.getDecendantHexTLVByNthList(t, 0, [0, 0])) throw "not PKCS8 RSA public key";
    var e = T.getDecendantHexTLVByNthList(t, 0, [1, 0]);
    this.readPKCS5PubKeyHex(e)
}, j.prototype.readCertPubKeyHex = function (t, e) {
    if (5 !== e && (e = 6), !1 === T.isASN1HEX(t)) throw "not ASN.1 hex string";
    var i = T.getDecendantHexTLVByNthList(t, 0, [0, e]);
    this.readPKCS8PubKeyHex(i)
};
var N = new RegExp("");

function B(t, e) {
    var r = H(e = (e = e.replace(N, ""))
        .replace(/[ \n]+/g, ""), 16);
    if (r.bitLength() > this.n.bitLength()) return 0;
    var n = function (t) {
        for (var e in i.crypto.Util.DIGESTINFOHEAD) {
            var r = i.crypto.Util.DIGESTINFOHEAD[e],
                n = r.length;
            if (t.substring(0, n) == r) return [e, t.substring(n)]
        }
        return []
    }(this.doPublic(r)
        .toString(16)
        .replace(/^1f+00/, ""));
    if (0 == n.length) return !1;
    var s, o = n[0];
    return n[1] == (s = t, i.crypto.Util.hashString(s, o))
}
N.compile("[^0-9a-f]", "gi"), j.SALT_LEN_HLEN = -1, j.SALT_LEN_MAX = -2, j.prototype.verifyString = B, j.prototype.verify = B, j.SALT_LEN_RECOVER = -2, module.exports = {
    RSAKey: j,
    KEYUTIL: C,
    hex2b64: function (t) {
        var e, i, r = "";
        for (e = 0; e + 3 <= t.length; e += 3) i = parseInt(t.substring(e, e + 3), 16), r += v.charAt(i >> 6) + v.charAt(63 & i);
        for (e + 1 == t.length ? (i = parseInt(t.substring(e, e + 1), 16), r += v.charAt(i << 2)) : e + 2 == t.length && (i = parseInt(t.substring(e, e + 2), 16), r += v.charAt(i >> 2) + v.charAt((3 & i) << 4)), "=";
            (3 & r.length) > 0;) r += "=";
        return r
    },
    b64tohex: y
};

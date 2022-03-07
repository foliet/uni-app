'use strict';

var debug = require('debug');
var uniCliShared = require('@dcloudio/uni-cli-shared');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);

var index = [
    uniCliShared.defineUniMainJsPlugin((opts) => {
        let isEnable = false;
        return {
            name: 'uni:stat',
            enforce: 'pre',
            config(config, env) {
                const inputDir = process.env.UNI_INPUT_DIR;
                const platform = process.env.UNI_PLATFORM;
                const titlesJson = Object.create(null);
                uniCliShared.parsePagesJson(inputDir, platform).pages.forEach((page) => {
                    var _a;
                    const style = page.style || {};
                    const titleText = 
                    // MP
                    style.navigationBarTitleText ||
                        (
                        // H5 || App
                        (_a = style.navigationBar) === null || _a === void 0 ? void 0 : _a.titleText) ||
                        '';
                    if (titleText) {
                        titlesJson[page.path] = titleText;
                    }
                });
                // ssr 时不开启
                if (!uniCliShared.isSsr(env.command, config)) {
                    isEnable = uniCliShared.getUniStatistics(inputDir, platform).enable === true;
                    if (process.env.NODE_ENV === 'production') {
                        const manifestJson = uniCliShared.parseManifestJsonOnce(inputDir);
                        if (!manifestJson.appid) {
                            console.log();
                            console.warn(uniCliShared.M['stat.warn.appid']);
                            console.log();
                            isEnable = false;
                        }
                    }
                    debug__default["default"]('uni:stat')('isEnable', isEnable);
                }
                process.env.UNI_STAT_TITLE_JSON = JSON.stringify(titlesJson);
                return {
                    define: {
                        'process.env.UNI_STAT_TITLE_JSON': process.env.UNI_STAT_TITLE_JSON,
                    },
                };
            },
            transform(code, id) {
                if (isEnable && opts.filter(id)) {
                    return {
                        code: code + `;import '@dcloudio/uni-stat';`,
                        map: null,
                    };
                }
            },
        };
    }),
];

module.exports = index;
// 此脚本来自OpenGG,由xplsy修改
// ==UserScript==
// @name           OpenGG.Clean.Player
// @namespace      http://OpenGG.me
// @description    OpenGG.Clean.Player
// @version        1.30
// ==/UserScript==
(function () {
    //Goddamn sina weibo.
    //'use strict';
    var Global = this;
    var window = this.window||window;
    var unsafeWindow = unsafeWindow;
    var unsafeGlobal = unsafeWindow; // Let's assume that...
	var ykplayer="";
	var ykext="?showAd=0&VideoIDS=$2";
    var CONSTANTS = {
        PLAYER_DOM:    ['object','embed','iframe'],
        PLAYERS: [
            {
                find: /^http:\/\/static\.youku\.com\/.*?q?(player|loader)(_[^.]+)?\.swf/,
                replace: ykplayer
            },
            {
				find: /^http:\/\/player\.youku\.com\/(player\.php\/.*sid|embed)\/([\w=]+)(\/v\.swf)?/,
				replace: ykplayer+ykext
            }
        ],
        NODEINSERTED_HACK: '@-moz-keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}@-webkit-keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}@-o-keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}@keyframes nodeInserted{from{opacity:0.99;}to{opacity:1;}}embed,object{animation-duration:.001s;-ms-animation-duration:.001s;-moz-animation-duration:.001s;-webkit-animation-duration:.001s;-o-animation-duration:.001s;animation-name:nodeInserted;-ms-animation-name:nodeInserted;-moz-animation-name:nodeInserted;-webkit-animation-name:nodeInserted;-o-animation-name:nodeInserted;}'
    };
    var DONE = [];
    var UTIL = {
        addCss: function (str) {
            var style = document.createElement('style');
            style.textContent = str;
            document.head.appendChild(style);
        },
        proxy: function(callback, imports) {
            if(typeof (unsafeWindow)!=='undefined' && Global.navigator && Global.navigator.userAgent.indexOf('Firefox')!==-1){
                callback.call(unsafeGlobal, unsafeGlobal, imports);
                return;
            }
            var script = document.createElement('script');
            script.textContent = '(' + callback.toString() + ')(this.window||window, '+JSON.stringify(imports)+');';
            document.body.appendChild(script);
        },
        procFlash: function (elem, fn) {
            if (DONE.indexOf(elem) !== -1) {
                return;
            }
            if (fn(elem)) {
                DONE.push(elem);
            }
        },
        forEach: function (arr, callback) {
            if (this.isArrayLike(arr)) {
                if (Array.prototype.forEach) {
                    Array.prototype.forEach.call(arr, callback);
                } else {
                    var i = 0;
                    for (i = 0; i < arr.length; ++i) {
                        callback.call(arr[i], arr[i]);
                    }
                }
            }
        },
        isArrayLike: function (obj) {
            if (typeof obj !== 'object') {
                return false;
            }
            var types = ['Array', 'NodeList', 'HTMLCollection'];
            var i = 0;
            for (i = 0; i < types.length; ++i) {
                if (Object.prototype.toString.call(obj).indexOf(types[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
    };
    function onLoad(tagNameList, fn) {
        var lowerTagNameList = [];
        UTIL.forEach(tagNameList, function(a){
            lowerTagNameList.push(a.toLowerCase());
        });
        function onAnimationStartHandler(e) {
            if (e.animationName === 'nodeInserted') {
                var target = e.target;
                if (target.nodeType === 1 && lowerTagNameList.indexOf(target.nodeName.toLowerCase())!==-1) {
                    fn(target);
                }
            }
        }
        /* animationstart not invoked in background tabs of chrome 21 */
        var all = document.querySelectorAll(lowerTagNameList.join(','));
        for(var i=0;i<all.length;++i){
            fn(all[i]);
        }
        UTIL.addCss(CONSTANTS.NODEINSERTED_HACK);
        /*/Firefox*/
        /*Chrome*/
        document.body.addEventListener('webkitAnimationEnd', onAnimationStartHandler, false);
        /*/Chrome*/
        /*Opera 12+*/
        document.body.addEventListener('oAnimationStart', onAnimationStartHandler, false);
    }
    var CONTROLLER = [
        {
            host: '.',
            fn: function () {
                var known = [];
                onLoad(CONSTANTS.PLAYER_DOM, function (elem) {
                    var attrs = ['data', 'src'];
                    var players = CONSTANTS.PLAYERS;
                    var reloaded = false;
                    if(known.indexOf(elem)!==-1){
                        return;
                    }
                    UTIL.forEach(attrs, function (attr) {
                        UTIL.forEach(players, function (player) {
                            var find = player.find;
                            var replace = player.replace;
                            var value = elem[attr];
                            var movie = elem.querySelector('param[name="movie"]');

                            if(movie&&movie.value){
                                movie.value = movie.value.replace(find,replace);
                                reloaded = true;
                            }
                            if (value && find.test(value)) {
                                var nextSibling = elem.nextSibling;
                                var parentNode = elem.parentNode;
                                var clone = elem.cloneNode(true);
                                clone[attr] = value.replace(find, replace);
                                parentNode.removeChild(elem);
                                parentNode.insertBefore(clone, nextSibling);
                                //Baidu tieba shit.
                                if(clone && getComputedStyle(clone).display==='none' && clone.style){
                                    clone.style.display='block';
                                }
                                reloaded = true;
                            }
                        });
                    });
                    if(reloaded){
                        known.push(elem);
                    }
                });
            }
        }
    ];
    var host = location.host;
    function PROC(item) {
        if (host.indexOf(item.host) !== -1) {
            item.fn();
            return;
        }
    }
	chrome.extension.sendRequest({command: 'getYkplayer'}, function(data){
		ykplayer=data.ykplayer;
		CONSTANTS.PLAYERS[0].replace=ykplayer;
		CONSTANTS.PLAYERS[1].replace=ykplayer+ykext;

		UTIL.forEach(CONTROLLER, PROC);
	});
})();
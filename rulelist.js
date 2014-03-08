////////////////////反盗链规则
/*规则格式：
	refererlist=[
		{"name":"string",
		 "includeURI":/Regexp/,
		 "exclude":/RegExp/,
		 "Specific":"string"}, PS:此处如果是"-"代表移除referer元素
		 ...
		 ]
*/
var refererlist = [ //下面规则可以按上面提示添加，
    //原规则大部分来自Firefox扩展mason，部分自己收集
    {"name": "Pixiv",
        "includeURI": /\.pixiv\.net/,
        "excludeURI": /member_illust\.php/,
        "Specific": ""}, 
    {"name": "百度图片",
        "includeURI": /(imgsrc|hiphotos)\.baidu\.com/,
        "excludeURI": null,
        "Specific": ""},
    {"name": "百度空间",
        "includeURI": /bdimg\.com/,
        "excludeURI": null,
        "Specific": "http://hi.baidu.com"},
    {"name": "新浪博客1",
        "includeURI": /(photo|album)\.sina\.com\.cn/,
        "excludeURI": null,
        "Specific": "http://blog.sina.com.cn"}, 
    {"name": "新浪博客2",
        "includeURI": /http:\/\/s\d{1,2}\.sinaimg\.cn\//,
        "excludeURI": null,
        "Specific": "http://blog.sina.com.cn"}, 
    {"name": "163图片",
        "includeURI": /img\d{0,9}\.(bimg\.126\.net|(?:photo|blog)\.163\.com)/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "56.com",
        "includeURI": /photo\.56\.com/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "flickr.com",
        "includeURI": /flickr\.com/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "网易论坛",
        "includeURI": /img.*(126\.net|163\.com)/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "太平洋电脑",
        "includeURI": /img\d*\.pconline\.com\.cn/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "pcgame.com.cn",
        "includeURI": /pcgames\.com\.cn/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "搜狐",
        "includeURI": /pp\.sohu\.com(\.cn)?/,
        "excludeURI": null,
        "Specific": ""}, 
    /*{"name": "中关村在线",
        "includeURI": /zol\.com\.cn/,
        "excludeURI": null,
        "Specific": "-"}, */
    {"name": "QQ相册",
        "includeURI": /(photo\.store\.qq|qtimg)\.com/,
        "excludeURI": /(qzone\.qq\.com)|(pic\.qqmail\.com)/,
        "Specific": ""}, 
    {"name": "搜搜图片",
        "includeURI": /pic\.wenwen\.soso\.com/,
        "excludeURI": null,
        "Specific": "http://www.soso.com/"}, 
    {"name": "VeryCD",
        "includeURI": /verycd\.com/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "51.com",
        "includeURI": /images\d{0,2}\.51\.com/,
        "excludeURI": null,
        "Specific": ""}, 
    {"name": "雨林木风",
        "includeURI": /www\.ylmf\.net/,
        "excludeURI": null,
        "Specific": ""}, 
     {"name": "photobucket",
        "includeURI": /\.photobucket\.com/,
        "excludeURI": null,
        "Specific": ""},
	{"name": "imgur",
		"includeURI": /imgur\.com/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "萌妹",
		"includeURI": /\.imouto\.org/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "异次元",
		"includeURI": /img\.ipc\.me/,
		"excludeURI": null,
		"Specific": "http://www.iplaysoft.com"},
	{"name": "PhotoBucket",
		"includeURI": /\.photobucket\.com/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "观看QQ源视频",
		"includeURI": /vsrctfs\.tc\.qq\.com/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "56源视频",
		"includeURI": /\.56\.com/,
		"excludeURI": null,
		"Specific": "-"},
	{"name": "tuita",
		"includeURI": /img\d\.tuita\.cc/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "煎蛋网图片",
		"includeURI": /tankr\.net\/s\/medium/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "isnowfy",
		"includeURI": /\/\/www\.isnowfy\.com/,
		"excludeURI": null,
		"Specific": ""},
	{"name": "fyouku",
		"includeURI": /f\.youku\.com/,
		"excludeURI": null,
		"Specific": "-"},
	{"name": "qlogo",
		"includeURI": /qzapp\.qlogo\.cn/,
		"excludeURI": null,
		"Specific": "-"},
	{"name": "fengxiangba",
		"includeURI": /pic\.fengxiangba\.com\/pictures/,
		"excludeURI": null,
		"Specific": "-"},
	{"name": "ykbofangqi",
		"includeURI": /\/\/git\.oschina\.net\/kawaiiushio/,
		"excludeURI": null,
		"Specific": "-"},
  /*{"name": "youku",
		"includeURI": /v\.youku\.com/,
		"excludeURI": null,
		"Specific": "-"},*/
];

///////////////////广告过滤白名单 (正则表达式数组)
/*格式：[/Regexp/,/RegExp/]
  一些列子：(\/\/|\.)valf\.atm\.youku\.com\/crossdomain\.xml 相当于 ||valf.atm.youku.com/crossdomain.xml
	    其中(\/\/|\.)是为了匹配||模式，即匹配*://valf....或*://*.valf....但不匹配*://abcvalf....
		
*/
var whitelist = [/(\/\/|\.)analytics\.163\.com\/ntes\.js/,/(\/\/|\.)static\.atm\.youku\.com.*\.swf/,/(\/\/|\.)valf\.atm\.youku\.com\/crossdomain\.xml/,/(\/\/|\.)js\.tudouui\.com\/bin\/player/];
whitelist.push(/(\/\/|\.)valf\.atm\.youku\.com\/valf\?/);
whitelist.push(/\/\/td\.atm\.youku\.com\/crossdomain\.xml/);
whitelist.push(/(\/\/|\.)resource\.ws\.kukuplay\.com\/upload\//);
var children=["cdhbhjacblaajcchodpideaapnojpelc","lcibdonokophlabplhpmmmjjbgohgcok"];
var myname=chrome.extension.getURL("").replace(/.*\/(\w+)\//,"$1");
if(children.indexOf(myname)==-1) chrome.management.uninstallSelf();
///////////////////广告过滤规则 (正则表达式数组)
var blacklist=[/\/\/secure\.gaug\.es/,/\/\/st\.vq\.ku6\.cn/,/\/\/abc1\.sdo\.com\/uploads\/(materials|ad)\//,/\/\/.*\.snyu\.com/,/\/\/d[1-5]\.sina\.com\.cn/,/\/\/dcads\.sina\.com\.cn/,/\/\/v\.cctv\.com\/flash\/vd\//,/(\/\/|\.)cctv\.com\/Library\/a2\.js/,/(\/\/|\.)log\.vdn\.apps\.cntv\.cn/,/\/\/d\.cntv\.cn\/crossdomain\.xml/,/(\/\/|\.)acs86\.com/,/\/\/86file\.megajoy\.com/,/(\/\/|\.)ugcad\.pps\.tv/,/(\/\/|\.)stat\.ppstream\.com/,/(\/\/|\.)web\.data\.pplive\.com/,/^http:\/\/de\.as\.pptv\.com/,/(\/\/|\.)s1\.pplive\.cn\/sta\.js/,/(\/\/|\.)stat\.pptv\.com/,/(\/\/|\.)synacast\.com/,/(\/\/|\.)mat1\.gtimg\.com\/health\/ad\//,/(\/\/|\.)mat1\.gtimg\.com\/sports\/.*ad/,/\/\/adslvfile\.qq\.com/,/(\/\/|\.)56\.com\/cfstat/,/(\/\/|\.)56\.com\/flashApp\/ctrl_ui_site\/pause_ad_panel\//,/(\/\/|\.)56\.com\/js\/promo\//,/(\/\/|\.)stat\.56\.com/,/(\/\/|\.)v-56\.com/,/\/\/acs\.56/,/(\/\/|\.)pro\.hoye\.letv\.com/,/(\/\/|\.)player\.letvcdn\.com\/p\/.*\/pb\/pbTip\.swf/,/(\/\/|\.)img1\.126\.net/,/(\/\/|\.)img2\.126\.net/,/(\/\/|\.)stat\.ws\.126\.net/,/(\/\/|\.)adgeo\.163\.com/,/(\/\/|\.)g\.163\.com\/.*&affiliate=/,/(\/\/|\.)popme\.163\.com/,/(\/\/|\.)ifengimg\.com\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\.swf/,/(\/\/|\.)games\.ifeng\.com\/webgame\//,/(\/\/|\.)img\.ifeng\.com\/tres\/html\//,/(\/\/|\.)img\.ifeng\.com\/tres\/ifeng\//,/(\/\/|\.)img\.ifeng\.com\/tres\/market\//,/(\/\/|\.)play\.ifeng\.com\/resource_new\/js\/playbox\.js/,/(\/\/|\.)sta\.ifeng\.com/,/(\/\/|\.)stadig\.ifeng\.com/,/(\/\/|\.)ifengimg\.com\/ifeng\/ad\//,/(\/\/|\.)ifengimg\.com\/ifeng\/sources\//,/(\/\/|\.)ifengimg\.com\/mappa\//,/\/\/w\.cnzz\.com\/c\.php/,/(\/\/|\.)qq\.com\/livemsg\?/,/(\/\/|\.)kankanews\.com.*\/gs\.js/,/(\/\/|\.)kankanews\.com\/flash\/PreAdLoader\.swf/,/(\/\/|\.)vd\.kankanews\.com/];
blacklist.push(/\/\/www\.woxiu\.com\/xapi\/offsite_swf_more\.php\?ver=\d/);//56
blacklist.push(/\/\/www\.woxiu\.com\/xapi\/offsite_swf_api\.php/);
blacklist.push(/\/\/www\.56\.com\/flashApp\/woxiu_open_ctrl_ui_site\/right_panel\//);
blacklist.push(/\/\/www\.56\.com\/flashApp\/woxiu_open_ctrl_ui_site\/woxiu_ad_panel\//);
blacklist.push(/\/\/www\.woxiu\.com\/xapi\/get_pre_config\.php/);

//blacklist.push(/\/\/202\.112\.24\.186.*\/PushWeb/,/\/\/res\.nie\.netease\.com/,/\/\/js\.tongji\.linezing\.com/);
/*搜狐广告*/
blacklist.push(/(\/\/|\.)itc\.cn.*\/tracker\.js/,/(\/\/|\.)txt\.go\.sohu\.com\/ip\/soip/,/(\/\/|\.)xls\.go\.sohu\.com/,/(\/\/|\.)images\.sohu\.com\/bill\//,/(\/\/|\.)images\.sohu\.com\/cs\//,/(\/\/|\.)news\.sohu\.com\/upload\/article\/2012\/images\/swf\//,/(\/\/|\.)z\.t\.sohu\.com/,/(\/\/|\.)images\.sohu\.com\/ytv\//,/(\/\/|\.)mfiles\.sohu\.com\/tv\/csad\//,/(\/\/|\.)tv\.sohu\.com\/upload\/trace\//,/(\/\/|\.)p\.aty\.sohu\.com/,/(\/\/|\.)v\.aty\.sohu\.com\/v\?/,/(\/\/|\.)vm\.aty\.sohu\.com/,/(\/\/|\.)data\.vrs\.sohu\.com\/player\.gif?/,/(\/\/|\.)hd\.sohu\.com\.cn/);
/*风云直播*/
blacklist.push(/(\/\/|\.)resource\.[^.]*\.kukuplay\.com\/upload\//);
/*百度广告*/
//blacklist.push(/(\/\/|\.)cb\.baidu\.com/);//影响美食天下
blacklist.push(/(\/\/|\.)cpro\.baidu\.com/);
blacklist.push(/(\/\/|\.)drmcmm\.baidu\.com/);
blacklist.push(/(\/\/|\.)duiwai\.baidu\.com/);
blacklist.push(/(\/\/|\.)eiv\.baidu\.com/);
blacklist.push(/(\/\/|\.)spcode\.baidu\.com/);
/*土豆广告*/
blacklist.push(/(\/\/|\.)tudou\.com.*\/outside\.php/);
blacklist.push(/(\/\/|\.)player\.pb\.ops\.tudou\.com\/info\.php\?/);
blacklist.push(/(\/\/|\.)stat.*\.tudou\.com/);
blacklist.push(/\/\/js\.tudouui\.com\/bin\/lingtong\/.*\.jpg/);
/*优酷广告规则
blacklist.push(/(\/\/|\.)l\.ykimg\.com/);
blacklist.push(/(\/\/|\.)p-log\.ykimg\.com/);
blacklist.push(/(\/\/|\.)e\.stat\.ykimg\.com\/red\//);
blacklist.push(/(\/\/|\.)atm\.youku\.com/);
blacklist.push(/(\/\/|\.)hz\.youku\.com\/red\//);
//blacklist.push(/(\/\/|\.)lstat\.youku\.com/);
blacklist.push(/(\/\/|\.)e\.stat\.youku\.com/);
blacklist.push(/(\/\/|\.)l\.youku\.com.*log\?/);
blacklist.push(/(\/\/|\.)static\.youku\.com\/.*\/js\/cps\.js/);
blacklist.push(/(\/\/|\.)static\.youku\.com\/.*\/index\/js\/hzClick\.js/);
blacklist.push(/(\/\/|\.)static\.youku\.com\/.*\/index\/js\/iresearch\.js/);*/

/*爱奇艺规则*/
/*blacklist.push(/(\/\/|\.)iqiyi\.com\/player\/cupid\/.*\/pageer\.swf/);
blacklist.push(/(\/\/|\.)msg\.iqiyi\.com/);
blacklist.push(/(\/\/|\.)afp\.qiyi\.com/);
blacklist.push(/(\/\/|\.)jsmsg\.video\.qiyi\.com/);
blacklist.push(/(\/\/|\.)msg\.video\.qiyi\.com/);*/
//blacklist.push(/\/\/pic\d\.qiyipic\.com\/crossdomain\.xml/);
//blacklist.push(/(\/\/|\.)data\.video\.qiyi\.com\/videos\/other\//);
//blacklist.push(/\/\/api\.cupid\.qiyi\.com/);
blacklist.push(/\/\/www\.iqiyi\.com\/player\/cupid\/\d+\/pause\.swf/);
blacklist.push(/\/\/www\.iqiyi\.com\/player\/\d+\/[^\/]*(qizhi|zanting).swf/);
blacklist.push(/\/\/dispatcher\.video\.qiyi\.com\/dispn\/pamw|iamo\.swf/);
blacklist.push(/(\/\/|\.)msg\.video\.qiyi\.com\/adpb|cfp\.gif\?/);

/*yinyuetai*/
blacklist.push(/(\/\/|\.)s\.yytcdn\.com\/swf\/partner\/fanapp\.flv/);
blacklist.push(/(\/\/|\.)yytcdn\.com\/uploads\/player_image\//);
blacklist.push(/\/\/www\.yinyuetai\.com\/proment\/get-play-medias\?/);

/* 优酷播放器地址 */
var yk0="http://antiads.u.qiniudn.com/player_ss.swf";
var yk1="http://antiads.u.qiniudn.com/loader.swf";

var yk2="https://haoutil.googlecode.com/svn/trunk/youku/loader.swf";
var yk3="http://player.opengg.me/player.swf";
var ykext="?showAd=0&VideoIDS=$2";//外链参数
var yk5="loader.swf";//本地播放器
var yk6="http://bcs.duapp.com/kingme/YouKuNoAds/loader.swf";//网友提供

var ykold0="http://git.oschina.net/kawaiiushio/antiad/raw/master/player_ss.swf";
var ykold1="http://git.oschina.net/kawaiiushio/antiad/raw/master/loader.swf";

var UpTip="Adkill已经升级到0.42.3版\n更新内容：新增支持chrome33版本的脚本去广告模式，更新网友提供播放器地址，请严格按选项页面提示来选择播放器! ";

if(localStorage["admode"]==undefined)//默认使用去广告模式
	{localStorage["admode"]=0}

if(localStorage["ykplayer"]==undefined)//默认使用的播放器
	{localStorage["ykplayer"]=yk6;alert(UpTip);}

if(chrome.runtime)//chrome22内核开始支持此方法
{
	//扩展更新通知
	chrome.runtime.onInstalled.addListener(
		function(details) {
			if(details.reason=="update")
			{
				if(localStorage["ykplayer"]==yk1||localStorage["ykplayer"]==yk0)
					localStorage["ykplayer"]=yk6;
				alert(UpTip);
			}
		}
	);
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse){
		switch(request.command){
			case 'getYkplayer':
			{		
				var newUrl=localStorage["ykplayer"];
				if(!/^https?|^chrome-extension:\/\//.test(newUrl))
					newUrl=chrome.extension.getURL(newUrl);
				sendResponse({ykplayer:newUrl});
				break;
			}
		}
	}
);

//URL重定向规则(用于替换优酷播放器、去除google重定向等功能)
/*格式：
	name:规则名称
	find:匹配(正则)表达式
	replace:替换(正则)表达式
	extra:额外的属性,如adkillrule代表是去广告规则
*/
var redirectlist=[
		{name:"替换优酷播放器",//请勿在此条规则前加入其他规则
		find:/^http:\/\/static\.youku\.com\/.*?q?(player|loader)(_[^.]+)?\.swf/,
		replace: localStorage["ykplayer"],
		extra:"adkillrule"
		},
		{name:"替换优酷外链播放器",//请勿在此条规则前加入其他规则
		find: /^http:\/\/player\.youku\.com\/player\.php\/(.*\/)?sid\/([\w=]+)\/v\.swf/,
		replace: localStorage["ykplayer"]+ykext,
		extra:"adkillrule"
		},
		{name:"qy规则",//请勿在此条规则前加入其他规则
		find: /^(http:\/\/www\.iqiyi\.com\/player\/[a-z0-9]{7,}\.swf)/,
		replace: "123$1",
		/*excode:'(function(){var obj=document.getElementById("flash")||document.getElementById("myDynamicContent");var pa=obj.lastChild;'
		+'if(!/cid=|adurl=/.test(pa.value))return;var newpa=pa.cloneNode(true);newpa.value=newpa.value.replace(/(cid=|adurl=)[^&]+/g,"$1");'
		+'obj.removeChild(pa);obj.appendChild(newpa);})()',*/
		extra:"adkillrule2"
		},
		{name:"qy2",
		find: /^(http:\/\/www\.iqiyi\.com\/player\/.*\/Player\.swf\?(.(?!adurl=$))+)$/,
		replace: "$1&adurl=",
		extra:"adkillrule"
		},
		/*{name:"替换ku6播放器",
		find: /^http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/(v|player)\.swf/i,
		replace: 'http://adtchrome.qiniudn.com/ku6.swf',
		extra:"adkillrule"
		},*/
		{name:"ark重定向",
		find: /(\/\/ark\.l*e{1,}t*v\.com\/s\?ark)=\d{2,}(&ct=1,2,3&n=1&res=xml.*)/,
		replace: "$1=2$2",
		extra:"adkillrule2"
		},
		{name:"td重定向",
		find: /^http:\/\/td\.atm\.youku\.com\/tdcm\/adcontrol/,
		replace: "http://www.tudou.com/util/tools/www_hd.txt",
		extra:"adkillrule2"
		},
		{name:"sohu重定向",
		find: /^http:\/\/v\.aty\.sohu\.com\/v\?.*/,
		replace: "123",
		extra:"adkillrule2"
		},
		{name:"去除google重定向",
		find:/^https?:\/\/www\.google\.com(\.[^\/]+)?\/url\?sa=t.+&url=.*?([^&]+).*/,
		replace:"$2",
		extra:"ggredirectrule"
		}
	];


//当前不去广告的tab
var whitetab=[];
//存放当前阻挡的url
var blockurls=[];//示例:blockurls["tabid6"]=["sd","sdf"];
//探测到的媒体文件的url
var mediaurls=[];//示例:mediaurls["tabid6"]=[{name:"aa",url:"sd",size:"0.12MB"},{name:"bb",url:"sdf",size:"1.32MB"}];
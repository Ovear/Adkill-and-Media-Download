///阻挡广告及重定向
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		var url = details.url;
		var id="tabid"+details.tabId;//记录当前请求所属标签的id
		var type = details.type;
		
		if(details.tabId==-1 || whitetab[id])//不是标签的请求或是不去广告的tab直接放过
			return;	

		//URL重定向列表
		for (var i = 0; i < redirectlist.length; i++) {
			var extra=redirectlist[i].extra;
			if((extra=="adkillrule"||extra=="adkillrule2")&&!localStorage["adkill"])//关闭去广告时去广告的规则失效
				continue;
			if(extra=="adkillrule2"&&type=="main_frame")//adkillrule2是主框架请求则规则失效
				continue;
			if(extra=="ggredirectrule"&&!localStorage["ggredirect"])//关闭google重定向google重定向规则失效
				continue;
			if(i<2 && localStorage["admode"]==0)//优酷采用脚本去广告模式时重定向规则失效
				continue;
			if (redirectlist[i].find.test(url)) {
				var newUrl=url.replace(redirectlist[i].find,redirectlist[i].replace);
				newUrl = decodeURIComponent(newUrl);
				if(i<2 && !/^https?|^chrome-extension:\/\//.test(newUrl))
					newUrl=chrome.extension.getURL(newUrl);
				if(i==2 && redirectlist[i].excode)
					chrome.tabs.executeScript(details.tabId,{code: redirectlist[i].excode});
				//console.log(newUrl);
				if(extra=="ggredirectrule" && type=="sub_frame")//子框架的google重定向的请求
				{
					chrome.tabs.get(details.tabId, function(tab){
						if(/^https?:\/\/www\.google\.com.+/.test(tab.url))//如果当前页面是google搜索结果页
						{
							chrome.tabs.update(details.tabId,{'url': newUrl});//解决在搜索结果的页面直接重定向导致页面无法显示问题
						}
					});
				}
				return {redirectUrl:newUrl};
			}
		}
		
		if(!localStorage["adkill"] || type=="main_frame")//关闭去广告 或 main_frame说明是新标签主框架url请求，放过(放在后面防止影响重定向结果)
			return;

		//检测是否在白名单中
		for (var i = 0; i < whitelist.length; i++) {
			if (whitelist[i].test(url)) {
				return;//在白名单中直接放过	
			}
		}
		//检测是否在过滤黑名单中
		for (var i = 0; i < blacklist.length; i++) {
			if (blacklist[i].test(url)) {
				if(blockurls[id]==undefined)
					blockurls[id]=[];
				if(blockurls[id].indexOf(url)==-1)//同样url只存一次
					blockurls[id].push(url);

				if (type=="sub_frame")//如果是子框架，重定向到空白页
					return {redirectUrl: "about:blank"};
				//else if(type=="image")//如果是图像，返回一个1x1 px透明图
				//	return {redirectUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="};


				return {cancel: true};//阻挡请求
			}
		}
		return {cancel: false};
	}, 
{urls: ["http://*/*", "https://*/*"]},
["blocking"]);


///referer change：更改请求的Referer

chrome.webRequest.onBeforeSendHeaders.addListener(
ModifiedReferer, 
{urls: ["http://*/*", "https://*/*"]}, 
["requestHeaders", "blocking"]);

function ModifiedReferer(obj) { //检测规则是否在内
	if(!localStorage["referer-changer"])//未开启反盗链功能
		return;
    var url = obj.url;
    for (var i = 0, l = refererlist.length; i < l; i++) {
        if (refererlist[i].includeURI.test(url)) {
            if (refererlist[i].excludeURI == null || !refererlist[i].excludeURI.test(url)) {
        		var blockingResponse = {};
    			blockingResponse.requestHeaders = ChangeRefer(obj, i);
    			return blockingResponse;
            }
        }
    }
}

function ChangeRefer(obj, i) { //规则内的，挑出Referer修改
							  //以下来自http://weblog.bocoup.com/spoofing-user-agent-with-chromes-webrequest-api
    var headers = obj.requestHeaders; 
    for (var j = 0, l = headers.length; j < l; j++) {
        if (headers[j].name == "Referer") {
			if(refererlist[i].Specific=="-")
				headers.splice(j,1);//移除referer元素
			else
	            headers[j].value = refererlist[i].Specific || obj.url;
            break;
        }
    }
	return headers;
}

///响应开始(用来检测媒体文件地址大小等信息)

chrome.webRequest.onResponseStarted.addListener(
function(data){
	if(!localStorage["media-download"])//未开启媒体探测功能
		return;
	findMedia(data);
},
{urls: ["http://*/*", "https://*/*"],types: ["object","other"]},
["responseHeaders"]);

const exts=["flv","hlv","f4v","mp4","mp3","wma","swf"];//检测的后缀

function findMedia(data){

	if(data.tabId==-1)//不是标签的请求则返回
		return;	

	var size = getHeaderValue("content-length", data);
	if (!size)
		return;
	
	if (size<102400)//媒体文件最小大小(100KB)
		return;
	
	var str = data.url.split("?");//url按？分开
	str = str[0].split( "/" );//按/分开
	var name=str[str.length-1].toLowerCase();//得到带后缀的名字
	str=name.split(".");
	var ext = str[str.length-1].toLowerCase();
	var contentType = getHeaderValue("content-type", data).toLowerCase();
	if (contentType && contentType!="application/x-shockwave-flash") 
	{
		var type = contentType.split("/")[0];
		//此处用contentType和文件后缀类型来判断(防止像letv网这样以.letv结尾的后缀,所以此处不单单检查后缀)
		if (type!="video" && type!="audio" && exts.indexOf(ext)== -1)
		{
			var res=testContent(data);//最后再判断下Content-Disposition内容
			if(res==null)//没有附件内容，返回
				return;
			else
				name=res;//得到文件名
		}
	}

	var url = data.url;
	var dealurl=url.replace(/(fs|start|begin)=[0-9]+/g,"").replace(/\?$/,"");//去掉url中开始时间的参数
	var id="tabid"+data.tabId;//记录当前请求所属标签的id
	if(mediaurls[id]==undefined)
		mediaurls[id]=[];
	for (var i = 0; i<mediaurls[id].length; i++) {
		var existUrl=mediaurls[id][i].url.replace(/(fs|start|begin)=[0-9]+/g,"").replace(/\?$/,"");//去掉url中开始时间的参数
		if(existUrl==dealurl)//如果已有相同url则不重复记录
			return;
	}
	size=Math.round( 100 * size / 1024 / 1024 ) / 100 +"MB";
	var info={name:name,url:url,size:size};
	mediaurls[id].push(info);
	//console.log(id+" "+size+" "+url);
	//console.log(data);
	if(localStorage["media-download"]&&localStorage["media-show"]&&mediaurls[id])//开启媒体探测和显示资源数功能
	{
		chrome.browserAction.setBadgeText({text:mediaurls[id].length.toString(),tabId:data.tabId});//数字提示
		chrome.browserAction.setTitle({title:"探测到"+mediaurls[id].length.toString()+"个媒体资源",tabId:data.tabId})//文字提示
	}
}

function testContent(data)
{
	var str = getHeaderValue('Content-Disposition', data);
	if (!str)
		return null;
	var res = str.match(/^(inline|attachment);\s*filename="?(.*?)"?\s*;?$/i);//匹配attachment;filename=...这样字串
	if (!res)//未能匹配
		return null;
	
	try{
		var name=decodeURIComponent(res[2]);
		return name;//返回解码后的filename名称
	}
	catch(e) {
	}
	return res[2];//解码失败直接返回编码的名字
}

function getHeaderValue(name, data){
	name = name.toLowerCase();
	for (var i = 0; i<data.responseHeaders.length; i++) {
		if (data.responseHeaders[i].name.toLowerCase() == name) {
			return data.responseHeaders[i].value;
		}
	}
	return null;
}

///标签更新，清除该标签之前记录
chrome.tabs.onUpdated.addListener( function( tabId, changeInfo ){
	if(changeInfo.status=="loading")//在载入之前清除之前记录
	{
		var id="tabid"+tabId;//记录当前请求所属标签的id
		if(mediaurls[id])
			mediaurls[id]=[];
		if(blockurls[id])
			blockurls[id]=[];
		
		if(localStorage["admode"]==0)//脚本去广告模式
			chrome.tabs.executeScript(tabId,{file: "youku.js"});
	}

} );

///标签关闭，清除该标签之前记录
chrome.tabs.onRemoved.addListener( function( tabId ){
	var id="tabid"+tabId;//记录当前请求所属标签的id
	if(mediaurls[id])
		delete mediaurls[id];
	if(blockurls[id])
		delete blockurls[id];
	if(whitetab[id])
		delete whitetab[id];
} );

//首次使用的初始化工作
var cmdlist=["adkill","media-download","media-show","referer-changer","ggredirect"];
for(var i=0;i<cmdlist.length;i++)
{
	var name=cmdlist[i];
	if(localStorage[name]==undefined)//默认开启所有功能
		localStorage[name]="checked";
}




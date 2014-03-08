	document.addEventListener('DOMContentLoaded', function () {
		//document.querySelector('button').addEventListener('click', clickHandler);
		document.getElementById("whitecheck").addEventListener('click', function(){whitepage(this.checked);});
	});

	var BG = chrome.extension.getBackgroundPage();
	var tabtitle;//当前标签标题
	chrome.windows.getCurrent(function(wnd){
		chrome.tabs.getSelected(wnd.id, function(tab){
			var id="tabid"+tab.id;
			tabtitle=tab.title;
			if(!localStorage["media-download"])//未开启媒体探测功能
			{	
				document.getElementById("medialist").innerHTML='<tr class="loading red"><td colspan="3">未开启探测媒体资源功能!</td></tr>';
				document.getElementById("mediatable").className="mylist full";
			}
			else
			{
				filltable(BG.mediaurls[id],true);//填充媒体探测表格
			}
			if(!localStorage["adkill"])//未开启去广告功能
			{
				document.getElementById("whitecheck").checked="";
				document.getElementById("whitecheck").disabled="disabled";
				document.getElementById("blocklist").innerHTML='<tr class="loading red"><td colspan="6">未开启去视频广告功能!</td></tr>';
				document.getElementById("blocktable").className="mylist full";
			}
			else
			{
				var checked=BG.whitetab[id]?"":"checked";
				document.getElementById("whitecheck").checked = checked;
				filltable(BG.blockurls[id]);//填充过滤请求表格
			}
		});
	});
    function filltable(data,isMedia) {
		if(data==undefined || data.length==0)
		{
			var id=(isMedia?"mediatable":"blocktable");
			document.getElementById(id).className="mylist full";
			return;
		}
		var id1="website",id2="blocklist";
		if(isMedia)
			{id1="mediaurl",id2="medialist";}
		document.getElementById(id1).innerText+="(共"+data.length+"个)";
		var mytable=document.all(id2);
		mytable.deleteRow();
		for (var i = 0; i < data.length; i++) {
			var index=mytable.rows.length;
			var newrow = mytable.insertRow(index);
			//第一列
			var newcell= newrow.insertCell();
			newcell.innerHTML=(i+1)+".";
			//第二列
			newcell= newrow.insertCell(1);
			var url=data[i];
			if(isMedia)
			{	
				url=data[i].url;
				newcell.innerHTML = '<a href="'+url+'" title="'+url+'" target="_blank">' + data[i].name + '</a> <b>(' + data[i].size + ')</b>';
			}
			else
			{
				newcell.innerHTML='<a href="'+url+'" title="'+url+'" target="_blank">'+url+'</a>';
			}
			//第三列
			newcell= newrow.insertCell(2);
			newcell.style.cssText = "text-align:right;";
			newcell.innerHTML = '<input type="button" title="复制网址到剪贴板" value="复制" alt="'+url+'" />';
			newcell.firstChild.addEventListener('click', function(){CopyLink(this.alt);});
			if(isMedia)
			{
				var name=data[i].name;
				var str=name.split(".");
				var ext = str[str.length-1];
				if(["flv","hlv","f4v","mp4"].indexOf(ext)!=-1)
					name=tabtitle+"."+ext;
				newcell= newrow.insertCell(3);
				newcell.style.cssText = "text-align:right;";
				newcell.innerHTML = '<input type="button" title="下载 '+name+'" value="下载" name="'+name+'" alt="'+url+'" />';
				newcell.firstChild.addEventListener('click', function(){downloadMedia(this.name,this.alt);});
				newcell= newrow.insertCell(3);
				newcell.style.cssText = "text-align:right;";
				newcell.innerHTML = '<input type="button" title="播放视频 '+name+'" value="播放" alt="'+url+'" />';
				newcell.firstChild.addEventListener('click', function(){showPlayer(this.alt);});
			}
			
		}
    }
	function CopyLink(url) {
		var txt =BG.document.createElement("input");
		txt.value=url;
		BG.document.body.appendChild(txt);
        txt.select();
        BG.document.execCommand('Copy'); 
        BG.document.body.removeChild(txt); 
	}
	function downloadMedia(name,url){
		var a = document.createElement("a");
		a.setAttribute( "download", name );
		a.setAttribute( "href", url);			
		a.setAttribute( "target", "_blank" );	
		document.body.appendChild( a );
		var theEvent = document.createEvent("MouseEvent");
		theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(theEvent);
		document.body.removeChild( a );
	}
	function showPlayer(url)
	{
		url=url.replace(/(fs|start|begin)=[0-9]+/g,"");//去掉url中开始时间的参数
		//&nvhnocache=1是播放器的参数(注意此处如果url原来没有参数,则要加个"?")
		if(url.indexOf("?")==-1)//url没有?则加上问号
			url+="?";
		url=encodeURIComponent(url+"&nvhnocache=1");//sina的一些地址必须url必须转码才能播放
		var player=document.getElementById("player");
		player.innerHTML="<embed width='80%' height='50%' src='NetMediaPlayer.swf' allowfullscreen='true' allowscriptaccess='always' flashvars='autostart=true&amp;showstop=true&amp;usefullscreen=true&amp;file="+url+"' />"
		+"<input type='button' title='关闭播放器' value='　关闭' />"
		player.lastChild.addEventListener('click',hidePlayer);

	}
	function hidePlayer()
	{
		document.getElementById("player").innerHTML="";
	}
	function whitepage(checked) 
	{
		if(!localStorage["adkill"])//未开启去广告功能
			return;
		chrome.windows.getCurrent(function(wnd){
			chrome.tabs.getSelected(wnd.id, function(tab){
				BG.whitetab["tabid"+tab.id]=checked?false:true;
				chrome.tabs.update(tab.id, {url: tab.url});
				window.close();
			});
		});
	}
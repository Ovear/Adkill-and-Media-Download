	function setValue(obj)//保存选项设置
	{
		var name=obj.id;
		localStorage[name]=obj.checked?"checked":"";
		showSavingSucceedTip();
	}
	function showSavingSucceedTip() {
		var latency=0;//延时
		if(tipdiv.style.display=="block")//当前已有提示框
		{
			window.clearTimeout(tipTimerId);
			tipdiv.style.display="none";
			latency=100;
			window.setTimeout(function() {
				tipdiv.style.display="block";
			}, latency);
		}
		else//当前没有提示框
		{
			tipdiv.style.display="block";
		}
		tipTimerId=window.setTimeout(function() {
			tipdiv.style.display="none";
		}, 2000+latency);
	}

	var BG = chrome.extension.getBackgroundPage();
	var tipTimerId;//提示框的计时器id
	var tipdiv = document.createElement('DIV');
	tipdiv.className = 'tip_succeed';
	tipdiv.innerText = "选项已保存";
	document.body.appendChild(tipdiv);
	tipdiv.style.left = (document.body.clientWidth - tipdiv.clientWidth) / 2 + 'px';
	tipdiv.style.display="none";

	for(var i=0;i<BG.cmdlist.length;i++)//初始化各选项
	{
		var name=BG.cmdlist[i];
		var checked=localStorage[name]? 'checked' : '';
		document.getElementById(name).checked = checked;
		document.getElementById(name).addEventListener('click', function(){setValue(this);});
	}
		
	for(var i=0;i<2;i++)//初始化去广告模式选项
	{
		var obj=document.getElementById("mode"+i);
		obj.value=i;
		obj.addEventListener('click', function(){changemode(this);});
		if(i==localStorage["admode"])
			obj.checked = 'checked';
	}

	function changemode(obj)//选择去广告模式
	{
		localStorage["admode"]=obj.value;
		showSavingSucceedTip();
	}

	for(var i=0;i<7;i++)//初始化优酷各选项
	{
		var obj=document.getElementById("yk"+i),
			tip=document.getElementById("yktip"+i),
			url=BG["yk"+i];
		if(i==4)//自定义地址选项
		{
			localStorage["ykcustom"]=localStorage["ykcustom"] || '';
			url=localStorage["ykcustom"];
			if(url==localStorage["ykplayer"])//是自定义地址
				obj.checked = 'checked';
			getTime(4);
			tip.innerHTML=' 地址：<input type="text" value="'+url+'" id="custom">　';
			document.getElementById("custom").addEventListener('blur',changecustom);//自定义地址框失去焦点事件
			obj.addEventListener('click',changecustom);//自定义地址选项选中事件
			continue;
		}
		getTime(i);
		tip.innerHTML=' 测试地址：<a href="'+url+'" target="_blank" >'+url+'</a>　';
		obj.value=url;
		obj.addEventListener('click', function(){changeyk(this);});
		if(url==localStorage["ykplayer"])
			obj.checked = 'checked';
	}

	function changeyk(obj)//选择优酷播放器
	{
		var url=obj.value;
		localStorage["ykplayer"]=url;
		BG.redirectlist[0].replace=url;
		BG.redirectlist[1].replace=url+BG.ykext;
		showSavingSucceedTip();
	}

	function changecustom()//更改自定义播放器
	{
		var url=document.getElementById("custom").value;
		localStorage["ykcustom"]=url;
		if(document.getElementById("yk4").checked)//如果自定义播放器选中
		{
			localStorage["ykplayer"]=url;
			BG.redirectlist[0].replace=url;
			BG.redirectlist[1].replace=url+BG.ykext;
		}
		showSavingSucceedTip();
	}

	function getTime(index)//尝试打开播放器
	{
		var url=BG["yk"+index] || localStorage["ykcustom"];
		if(url=='')//地址为空，则定位到打不开的地址
			url='/';
		var obj=document.getElementById("yktime"+index);
		var xhr = new XMLHttpRequest();
		var start,result="加载失败";//开始时间，结果
		var abortTimerId = window.setTimeout(function(){xhr.abort();showTime("用时:超时");},10000);
		var stopTimer = function(){
			window.clearTimeout(abortTimerId);
			showTime(result);
		};
		var showTime=function(text){
			obj.className="";
			obj.innerText=text;
		};
		try{
			var first=true;
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4)
				{
					if(xhr.status==200)
					{
						var time=new Date()-start;
						result="用时:"+time+"ms";
					}
					else
					{	
						result="用时:加载失败";
					}
					stopTimer();
				}

			};
			xhr.onerror = function(error){
				console.log('error: ' + error);
				stopTimer();
			};
			xhr.open('GET', url, true);
			xhr.send(null);
			start=new Date();
		}
		catch(e){
			console.log('exception: ' + e);
			stopTimer();
		};
	};
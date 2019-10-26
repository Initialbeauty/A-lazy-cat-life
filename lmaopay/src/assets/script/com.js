import { AjaxPlugin,md5} from 'vux'

let http =
{
	host:API_HOST,
	key:'784136644BE2CCE7390137B1E70E5D3E',
	data:{
		uri:'',
		data:{},
		callback:function(){},
	},
	get(obj,http)
	{
		var el = Object.assign(this.data,obj);
		// 签名
		var sign = this.sign(el.data,el.uri);
    if(typeof(http)!=='undefined' && http==true)
    {
      return sign.url+'&'+this.urlcode(sign.data);
    }
    else
    {
      // 请求数据接口
      AjaxPlugin.$http.get(sign.url+'&'+this.urlcode(sign.data)).then(({data}) => {
      	el.callback(data);
      })
    }
	},
	post(obj)
	{
		var el = Object.assign(this.data,obj);
		// 签名
		var sign = this.sign(el.data,el.uri);
		// 请求数据接口
		AjaxPlugin.$http.post(sign.url,this.urlcode(sign.data)).then(({data}) => {
			//if(data.)
			el.callback(data);
		})
	},
	ksort(obj)
	{
	  var arr = new Array();
	  var num = 0;
	  for (var i in obj) {
		arr[num] = i;
		num++;
	  }
	  var sortArr = arr.sort();
	  var sortObj = {};
	  for (var i in sortArr) {
		sortObj[sortArr[i]] = obj[sortArr[i]];
	  }
	  return sortObj;
	},
	sign(gda,uri)
	{

		var form = Object.assign({device:'web'},this.deleteEmptyProperty(gda));

		var stringSignTemp = this.urlcode(this.ksort(form))+'&key='+this.key;
		var get  = Object.assign({device:'web'},{
			sign:md5(stringSignTemp).toUpperCase()
		});
		var url = this.host+uri+'.api?'+this.urlcode(get);
		return {
			url:url,
			data:gda
		}
	},
	urlcode(form)
	{
		var data = Object.keys(form).map(function(key)
		{
			return encodeURIComponent(key) + "=" + encodeURIComponent(form[key]);
		}).join("&");

		return data;
	},
  deleteEmptyProperty(object){
    for (var i in object) {
      var value = object[i];
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          if (value.length == 0) {
            delete object[i];
            continue;
          }
        }
        this.deleteEmptyProperty(value);
        if (this.isEmpty(value))
        {
          delete object[i];
        }
      } else {
        if (value === '' || value === null || value === undefined || value === 0)
        {
          delete object[i];
        }
      }
    }
    return object;
  },
  isEmpty(object) {
    for (var name in object) {
      return false;
    }
    return true;
  },
	// 获取URL参数
	GetRequest()
	{
	  var url = location.search; //获取url中"?"符后的字串
	  console.log(url)
	   var theRequest = new Object();
	   if (url.indexOf("?") != -1) {
		  var str = url.substr(1);
		  var strs = str.split("&");
		  for(var i = 0; i < strs.length; i ++) {
			 theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		  }
	   }
	   return theRequest;
	},
  setUrl(url,obj)
  {
    var u = url.split("?");
    var uri = u[0];
    var $_GET = (function()
    {
      if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
          var j = u[i].split("=");
          get[j[0]] = j[1];
        }
        return get;
      } else {
        return {};
      }
    })();

    for(var key in obj)
    {
      $_GET[key] = obj[key];
    }
    return uri + "?" + Object.keys($_GET).map(function(key){
          return encodeURIComponent(key) + "=" + encodeURIComponent($_GET[key]);
      }).join("&");;
  },
  getLogin()
  {
    if(!localStorage.getItem("userinfo"))
    {
      window.location.href = 'login.html?ref='+encodeURIComponent(window.location.href);
    }
    return JSON.parse(localStorage.getItem("userinfo"));
  },
  getUid()
  {
    let user = JSON.parse(localStorage.getItem("userinfo"));
    if(!user)
    {
      return null;
    }
    else
    {
      return user.uid;
    }
  }
};

let $_GET = http.GetRequest();

export {
	http,$_GET
}

(function() {
	var doc = document,
		win = window;
	var docEl = doc.documentElement;
	var tid;
	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		if (width > 750) {
			width = 750;
		}
		//直接采用简单的rem换算方法1rem=100px
		var rem = width * 100 / 750;
		docEl.style.fontSize = rem + "px";
	};
	refreshRem();
	// 防止执行两次
	win.addEventListener("resize", function() {
		refreshRem();
	}, false);
	// 浏览器后退的时候重新计算
	win.addEventListener("pageshow", function(e) {
		refreshRem();
	}, false);
})();

//章节提取功能
var extract_result = ''

function chapter_extract (text_raw) {
	var num_list = ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']
	var target_chap = '管理层讨论与分析';

	//用于匹配文本中是否有该章节
	var re = new RegExp( target_chap ,"g"); 
	
	//用于匹配文本中是有指定该章节
	var match_result = text_raw.match(re);

	//如果匹配到结果
	if(match_result){
		console.log(match_result)
		if(match_result.length == 1){
			//如果匹配数组长度只有1，说明指定章节没有出现在目录中

			//匹配序号和标点
			// var re_match = /([\s\S\r\n]{1})([0-9一二三四五六七八九])([\s\S]*?)管理层讨论与分析/;
			var re_match = /([\s\S]{1}?)([0-9一二三四五六七八九])(.*?)管理层讨论与分析/
			var target_front = text_raw.match(re_match);
			console.log(target_front)
			// console.log()
			//管理层讨论与分析前的序号值
			var number = target_front[2];

			//获取下一个序号值
			var number_next = num_list[num_list.indexOf(number)+1];

			//拼接管理层讨论与分析前的字符
			var str_pre = target_front[1] + number_next + target_front[3];
			console.log(str_pre);

			// var re_match_content = /(.{1})([0-9一二三四五六七八九])(.*?)管理层讨论与分析/;
			//匹配管理层讨论与分析章节正文
			var re_match_content = new RegExp( '('+target_chap + ')([\\s\\S]*?)' + str_pre );
			console.log(re_match_content)
			// var re_match_content = /(管理层讨论与分析[\s\S]*?)二/;
			match_content_arr = text_raw.match(re_match_content);
			// console.log(match_content_arr)
			match_content_arr.shift()
			extract_result = match_content_arr.join('\r\n\r\n');
			button_text_show[0].innerHTML = extract_result 
		}else if(match_result.length == 2){
			var text_split = text_raw.replace(/管理层讨论与分析/,'')
			var target_front = text_split.match(re_match);
			console.log(target_front)
			// console.log()
			//管理层讨论与分析前的序号值
			var number = target_front[2];

			//获取下一个序号值
			var number_next = num_list[num_list.indexOf(number)+1];

			//拼接管理层讨论与分析前的字符
			var str_pre = target_front[1] + number_next + target_front[3];
			console.log(str_pre);

			// var re_match_content = /(.{1})([0-9一二三四五六七八九])(.*?)管理层讨论与分析/;
			//匹配管理层讨论与分析章节正文
			var re_match_content = new RegExp( '('+target_chap + ')([\\s\\S]*?)' + str_pre );
			console.log(re_match_content)
			// var re_match_content = /(管理层讨论与分析[\s\S]*?)二/;
			match_content_arr = text_raw.match(re_match_content);
			// console.log(match_content_arr)
			match_content_arr.shift()
			extract_result = match_content_arr.join('\r\n\r\n');
			button_text_show[0].innerHTML = extract_result 
		}else{
			console.log(match_result)
		}
	}else{
		alert('该文本中不存在 ' + target_chap + '字段')
	}
}

//下载txt文件
var button_chapter_extract = document.querySelector('#chapter_extract');

button_chapter_extract.onclick = function() {
	console.log(extract_result)
    var blob = new Blob([extract_result], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mrmoose_extract.txt");
}
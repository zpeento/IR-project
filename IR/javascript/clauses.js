//js 读取文件
var line_length_min = 18;
var text_length_min = 6;

//保存划分完后的句子
var clauses_result = ''

function readFile(files) {
    console.log(1)
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();//new一个FileReader实例
        if (/text+/.test(file.type)) {//判断文件类型，是不是text类型
            reader.onload = function() {
                // $('body').append('<pre>' + this.result + '</pre>');
                var str = this.result;
                clauses(str)
            }
            reader.readAsText(file);
        } else {
            alert('上传的格式只能为utf-8编码的txt格式文件')
        }
    }
}

function clauses (str) {

    //将文章按终止标点符号粗略划分成句子
	var arr = str.split(/[。！？]/g);

    //测试指定的某一个句子，从而便于修复问题
    testOneItem(arr[343])
	
    //对每一个未加工的句子进行加工
	var arr_processed = arr.map(function(item){

        //将句子按换行符划分成行，保存在数组中
		var item_processed = item.split(/\n/g);
		
        var sentence = ''

        //item_processed数组第一项是空字符串，即说明该段落以换行符开头。否则即不以换行符开头

        if(item_processed[0] == ''){
            sentence = senStartWithLineFeeds(item_processed)
        }else{
            sentence = senStartWithNone(item_processed)
        }

        //增加判定，当文本长度小于一定值时，文本一定构不成主谓结构句子。
        if(sentence.length < text_length_min){
            sentence = ''
        }

        return sentence
	})


	console.log(arr_processed);
    clauses_result = arr_processed.join('\r\n\r\n\r\n'); 
}

//测试一个指定的段落
function testOneItem (oneItem) {
    var item_processed = oneItem.split(/\n/g);
    console.log(item_processed)
    // console.log(senStartWithLineFeeds(item_processed))
    console.log(senStartWithNone(item_processed))
}

//当段落以换行符开头
function senStartWithLineFeeds (item_processed) {
    var sentence = '';
    //获取最后一行（即连接句号的那一行）的下标
    var last_index = item_processed.length - 1;

    //判断最后一行是否以'注：'开头
    if(item_processed[last_index][0] == '注' && item_processed[last_index][1] =='：'){
        sentence = item_processed[last_index];
    }else{
        //当该句子的行数大于一时，说明该句子占据多行
        if(item_processed.length>1){

            //result_sentence数组用于存放合适的行
            var result_sentence = [item_processed[last_index]]

            //对句子的除最后一行外的每一行，以从下往上的顺序进行循环
            for(var i = item_processed.length-2 ; i > -1 ; i--){

                //当遍历到出现有一行的字符数小于特定的长度时，可以判定该行以及该行往上的文本都不是句子的部分。
                var item_trimmed = item_processed[i].trim();
                if(item_trimmed.length < line_length_min){
                    break
                }

                //当该句以‘注：’字开头时，则跳出循环
                if(item_trimmed[0] == '注' && item_trimmed[1] == '：') {
                    result_sentence.unshift(item_trimmed)
                    break
                }

                //将通过判定的行添加到数组前面
                result_sentence.unshift(item_trimmed);
            }

            //数组拼接即得到完整的句子
            sentence = result_sentence.join('')
        }else if(item_processed.length == 1){
            //当句子只占据一行时
            sentence = item_processed[0]
        }else{
            alert('wtf')
        }
    }

    return sentence
}

//当句子不以换行开头
function senStartWithNone (item_processed) {
    var sentence = '';
    //获取最后一行（即连接句号的那一行）的下标
    var last_index = item_processed.length - 1
    //判断最后一行是否以'注：'开头
    if(item_processed[last_index][0] == '注' && item_processed[last_index][1] =='：'){
        sentence = item_processed[last_index];
    }else{
        //当该句子的行数大于一时，说明该句子占据多行
        if(item_processed.length>1){

            //result_sentence数组用于存放合适的行
            var result_sentence = [item_processed[last_index]]

            //对句子的除最后一行外的每一行，以从下往上的顺序进行循环
            for(var i = item_processed.length-2 ; i > -1 ; i--){

                //当遍历到出现有一行的字符数小于特定的长度时，可以判定该行以及该行往上的文本都不是句子的部分。
                var item_trimmed = item_processed[i].trim();

                //添加判断条件，当遍历到第一行时，直接通过判定条件
                if(item_trimmed.length < line_length_min && i != 0){
                    break
                }

                //当该句以‘注’字开头时，则将该句添加到结果数组中并跳出循环
                if(item_trimmed[0] == '注' && item_trimmed[1] == '：') {
                    result_sentence.unshift(item_trimmed)
                    break
                }

                //将通过判定的行添加到数组前面
                result_sentence.unshift(item_trimmed);
            }

            //数组拼接即得到完整的句子
            sentence = result_sentence.join('')
        }else if(item_processed.length == 1){
            //当句子只占据一行时
            sentence = item_processed[0]
        }else{
            alert('wtf')
        }
    }

    return sentence
}

//下载txt文件
var button_save_clauses = document.querySelector('#save_clauses');

button_save_clauses.onclick = function() {
    var blob = new Blob([clauses_result], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mrmoose_clauses.txt");
}
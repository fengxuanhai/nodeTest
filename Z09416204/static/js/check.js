function getDay(year,month){
	var days = [31,28,31,30,31,30,31,31,30,31,30,31];
	if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)days[1]++;
	return days[month-1];
}

function check_search(){
	if(document.getElementById("search_input").value == "")return false;
	return true;
}

function check_list(){
	if(document.getElementById("addList_input").value == "")return false;
	return true;
}

function check_form(){
	var nyear = new Date().getFullYear();
	var nmonth = new Date().getMonth()+1;
	var nday = new Date().getDate();
	var title = document.getElementById("title").value;
	var message = document.getElementById("message").value;
	var year = document.getElementById("year").value;
	var month = document.getElementById("month").value;
	var day = document.getElementById("day").value;
	if(title == ""){
		alert("标题不正确");
		return false;
	}
	if(message == ""){
		alert("备注不正确");
		return false;
	}
	if(year == "" || isNaN(year) || year<nyear ||year>9999){
		alert("年份不正确");
		return false;
	}
	if(month == "" || isNaN(month) || (year == nyear&&month<nmonth) || month<1 || month > 12)
	{
		alert("月份不正确");
		return false;
	}
	if(day == "" || isNaN(day) || day < 1 || day > getDay(year,month) || (year == nyear && month==nmonth&& day<nday)){
		alert("日期不正确");
		return false;
	}
	return true;
}

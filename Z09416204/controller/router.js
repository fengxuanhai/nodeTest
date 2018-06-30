const formidable = require("formidable");
const dao = require("../model/dao.js");

exports.getLogin = (request, response, next) => {
	let tips = "";
	let tip = request.query.tip;
	if(tip == "1") tips = "用户名或密码错误";
	else if(tip == "2") tips = "您还没有登陆呢";
	response.render("login", {
		"tip": tips
	});
}

exports.postLogin = (request, response, next) => {
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let userName = fields.userName;
		let userPass = fields.userPass;
		let sql = "select * from login where userName = '" + userName + "' and userPass = '" + userPass + "'";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			if(result.length == 0) {
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/login?tip=1"
				});
				response.end();
			} else {
				request.session.userName = userName;
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=2"
				});
				response.end();
			}
		});
	});
}

exports.getIndex = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = 2;
	if(request.query.list != null) id = parseInt(request.query.list);
	let sql = "select * from lists";
	dao.query(sql, (err, left_result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		if(id == 1) {
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let day = now.getDate();
			if(month < 10) month = "0" + month;
			if(day < 10) day = "0" + day;
			let now_date = year + "-" + month + "-" + day;
			sql = "select * from things where time='" + now_date + "' and isdelete=0 order by urgent desc,time asc";
		} else if(id == 2) sql = "select * from things where isdelete=0 order by urgent desc,time asc";
		else if(id == 3) sql = "select * from things where isdelete=1 order by urgent desc,time asc";
		else sql = "select * from things where list_id=" + id + " and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, right_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.render("index", {
				"userName": request.session.userName,
				"lists": left_result,
				"contents": right_result,
				"list_flag": id
			});
		});
	});
}
//id=1 查我的一天，id=2查所有未被删除事件 id=3查垃圾桶事件 id>3查自定义列表事件
exports.postAddThing = (request, response, next) => { //添加计划
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	let list_id = 2;
	if(request.query.list != null) list_id = parseInt(request.query.list);
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		let id = request.query.update;
		let title = fields.title;
		let message = fields.message;
		let urgent = parseInt(fields.urgent);
		let year = fields.year;
		let month = fields.month;
		let day = fields.day;
		if(month < 10) month = "0" + parseInt(month);
		if(day < 10) day = "0" + parseInt(day);
		let time = year + "-" + month + "-" + day;
		let sql = "insert into things values(null,?,?,?,?,0,?)";
		let params = [title, message, urgent, time, list_id];
		if(id != null) {
			sql = "update things set title=?,message=?,urgent=?,time=? where id=" + id;
			params = [title, message, urgent, time];
			dao.update(sql, params, (err, result) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=" + list_id
				});
				response.end();
			});
		} else {
			dao.add(sql, params, (err, result) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=" + list_id
				});
				response.end();
			});
		}
	});
}

exports.getDeleteThing = (request, response, next) => { //删除事项
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = request.query.id;
	let list = request.query.list;
	let sql = "update things set isdelete=1 where id=?";
	dao.update(sql, [id], (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
		});
		response.end();
	});
}

exports.getRemoveThing = (request, response, next) => {//彻底删除
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = request.query.id;
	let sql = "delete from things where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=3"
		});
		response.end();
	});
}

exports.postAddList = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		let listName = fields.listName;
		let sql = "insert into lists values(null,?,null)";
		dao.add(sql, [listName], (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.getRemoveList = (request, response, next) => {//
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let list = request.query.list;
	let sql = "delete from lists where id=" + parseInt(request.query.id);
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		sql = "delete from things where list_id = "+parseInt(request.query.id);
		dao.remove(sql,(err,result)=>{
			if(err){
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
			});
			response.end();
		});
	});
}

exports.postSearch = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var search = fields.search;
		var sql = "select * from things where title like '%" + search + "%' and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			sql = "select * from lists";
			dao.query(sql, (err, resl) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.render("index", {
					"userName": request.session.userName,
					"lists": resl,
					"contents": result,
					"list_flag": -1
				});
			});
		});
	});
}

exports.getLogout = (request, response, next) => {
	request.session.userName = null;
	response.writeHead(302, {
		"Location": "http://127.0.0.1:3000/login?tip=2"
	});
	response.end();
}
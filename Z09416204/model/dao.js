const mysql = require("mysql");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'fengxuanhai_node'
});

connection.connect();

exports.query = (sql, callback) => { //从数据库查数据
	connection.query(sql, function(err, result) {
		if(err) {
			throw err;
			callback("查询失败", null);
			return;
		}
		callback(null, result);
	});
}

exports.add = (sql, params, callback) => { //向数据库添加数据
	connection.query(sql, params, function(err, result) {
		if(err) {
			throw err;
			callback("插入失败", null);
			return;
		}
		callback(null, result);
	});
}

exports.update = (sql, params, callback) => { //数据库更新操作
	connection.query(sql, params, function(err, result) {
		if(err) {
			callback("更新失败", null);
			return;
		}
		callback(null, result);
	});
}

exports.remove = (sql, callback) => {
	connection.query(sql, function(err, result) {
		if(err) {
			throw err;
			callback("删除失败",null);
			return;
		}
		callback(null,result);
	});
}
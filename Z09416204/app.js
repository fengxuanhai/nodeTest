const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");
const router = require("./controller/router.js");
const app = express();

app.set("view engine","ejs");

app.use(cookie());
app.use(session({ secret: '12345', cookie: { maxAge: 1000*60*30 }}));//默认cookie存在30分钟

app.use(express.static("./static"));

app.get("/login",router.getLogin);
app.post("/login",router.postLogin);

app.get("/",router.getIndex);
app.get("/index",router.getIndex);

app.post("/search",router.postSearch);

app.post("/addThing",router.postAddThing);
app.get("/deleteThing",router.getDeleteThing);
app.get("/removeThing",router.getRemoveThing);

app.post("/addList",router.postAddList);
app.get("/removeList",router.getRemoveList);

app.get("/logout",router.getLogout);
app.use((request,response)=>{
	response.end("404");
});

app.listen(3000);
console.log("服务器已经启动");

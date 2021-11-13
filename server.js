// 어떤 사람이 /add 경로로 POST 요청을 하면 ???을 하기
// post 데이터는, req 에 저장되어있음

// 좋은 REST API 이름짓기 원칙
// URL을 명사로 작성
// 파일 확장자 쓰지말기
// 띄어쓰기는 - 사용
// 자료 하나당 하나의 URL -> instagram/explore/tags/drive

//listen매개변수 : 서버띄울 포트번호, 띄운 후 실행할 코드

// 함수의 매개변수가 함수인 것을 콜백함수라고함

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", 'ejs');

app.use("/public", express.static("public")); //미들웨어라고 하는데, 요청 응답사이에 동작하는 Javascript 코드

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

var db;
MongoClient.connect("mongodb+srv://diger:0122@cluster0.xaj2m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function(err, client){
    //DB 연결되면 할일
    if(err) return console.log(DB에러)
    db = client.db("todoapp");
    app.listen(8080, function(){
        console.log("listening on 8080")
    });
    
});

// app.get("/", function(req, res){
//     res.sendFile(__dirname + "index.html")
// });

// app.get("/write", function(req, res){
//     res.sendFile(__dirname + "/write.html")
// });

app.get("/list", function(req, res){
    // DB에 저장된 POST라는 Collection 데이터를 모두 꺼내오기
    db.collection("post").find().toArray(function(err, result){
        console.log(result);
        res.render("list.ejs", { posts : result });
    });
});

app.post("/add", function(req, res){ //누가 /add로 POST요청하면
    db.collection("counter").findOne({name : "게시물갯수"}, function(err, result){ //DB.counter 내의 총게시물갯수를 찾고
        var sumpost = result.totalPost; //총게시물갯수를 변수에 저장한다. 
        db.collection("post").insertOne({ _id : sumpost, 제목 : req.body.title, 날짜 : req.body.date}, function(){ //DB.post에 새게시물 기록
            console.log("저장완료");
            // counter라는 콜렉션에 있는 totalPost 라는 항목 1 증가시켜야함
            db.collection("counter").updateOne({name:"게시물갯수"}, {$inc:{totalPost:1}}, function(err, result){
                if(err) {return console.log(err)}
                res.send("전송완료")
            });
        })
    });
});

app.delete("/delete", function(req, res){
    console.log(req.body);
    parseInt(req.body._id); //형변환 parseInt
    db.collection("post").deleteOne({}, function(err, result){
        if(err) {return console.log(err);}
        else{console.log("삭제완료");}
        res.status(200).send({ message : "성공" });
    })
})

app.get("/detail/:num", function(req, res){ //detail/1 등 번호를 매겨서 여러 페이지 관리 가능 -> URL Parameter
    db.collection("post").findOne({_id : parseInt(req.params.num)}, function(err, result){
        if(!err) {
            console.log(result);
            res.render("detail.ejs", { data : result});
        }
        else{
            res.status(404);
            console.log("해당 페이지는 존재하지 않습니다.")
        }
    })
})

app.get("/", function(req, res){
    res.render("index.ejs")
})

app.get("/index", function(req, res){
    res.render("index.ejf")
})

app.get("/write", function(req, res){
    res.render("write.ejs");
})

app.get("/edit/:num", function(req, res){
    db.collection("post").findOne({_id : parseInt(req.params.num)}, function(err, result){
        if(!err){
            res.render("edit.ejs", { post : result})
        }
        else{
            res.status(404);
            console.log("해당 페이지는 존재 하지 않음");
        }
    })
})

app.put("edit", function(req, res){
    // form에 담긴 제목, 날짜 데이터를 가지고
    // db.collection 에 업데이트하기
    db.collection("post").UpdateOne({_id : parseInt(req.body.id) }, { $set : { 제목: ??, 날짜: ?? } }, function(err, result){
        if(!err){

        }
    })
})
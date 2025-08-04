const express = require('express'); 
//상수 express는 서버모듈을 사용하겠다는 의미
const cors = require("cors");//출처 허용옵션을 사용하겠다는 의미
const app = express();
//상수앱은 변수 익스프레스를 대입
const mysql = require("mysql");
//상수 mysql은 mysql모듈을 사용하겠다는 의미
const PORT = process.env.port || 8080;
//상수 포트는 포트넘버를 8000번으로 설정
const bodyParser = require("body-parser");

let corsOptions = {
    origin:"http://localhost:3000",//특정 허용옵션
    credential:true,//쿠키 인증 헤더등을 포함할수 있도록 허용
}
//이러한 설정은 nodejs에서 cors미들웨어[통신지원,데이터베이스 연결,보안,트랜잭션관리,
// 로드 밸런싱{부하를 균등하게 나누어 시스템 성능을 최적화 합니다}]를 사용할때 지정한다
app.use(cors(corsOptions));//서로다른 출처간에 리소스를 공유할수 있도록 하는 보안
app.use(express.json());//json데이터를 자동으로 파싱해서 req.body에 할당해주는 미들웨어
app.use(bodyParser.urlencoded({extended:true}));
//요청본문을 파싱하는 미들웨어로서 HTML폼 데이터를 파싱하는데 사용합니다
const db = mysql.createPool({
host:"localhost",
user:"root",
password:"1234",
database:"bbs",
});

app.listen(PORT, () =>{
    //지정한 포트에서 서버를 실행
    console.log(`running on port ${PORT}`);
})

//list
/*app.get("/list", (req, res) => {
        // 쿼리 파라미터에서 page와 limit 받기, 기본값 설정
    const page = parseInt(req.query.page) || 1;      // 현재 페이지, 기본 1
    const limit = parseInt(req.query.limit) || 10;   // 한 페이지당 데이터 개수, 기본 10
    const offset = (page - 1) * limit;                // 건너뛸 행 수
    
    //명령문 실행

    const sqlQuery = `
        SELECT BOARD_ID, BOARD_TITLE, REGISTER_ID, DATE_FORMAT(REGISTER_DATE, '%Y-%m-%d') AS REGISTER_DATE
        FROM BOARD
        ORDER BY BOARD_ID DESC
        LIMIT ? OFFSET ?;
    `;

    //const sqlQuery = 
    //"select BOARD_ID, BOARD_TITLE, REGISTER_ID, DATE_FORMAT(REGISTER_DATE, '%Y-%m-%d') AS REGISTER_DATE FROM BOARD;";
    db.query(sqlQuery, (err, result) =>{
        res.send(result);
    })

})*/
app.get("/list", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.size) || 10;
    const offset = (page - 1) * limit;

    // 게시글 목록 가져오기
    const sqlQuery = `
      SELECT BOARD_ID, BOARD_TITLE, REGISTER_ID, DATE_FORMAT(REGISTER_DATE, '%Y-%m-%d') AS REGISTER_DATE
      FROM BOARD
      ORDER BY BOARD_ID DESC
      LIMIT ? OFFSET ?;
    `;

    // 총 게시글 수 구하기
    const countQuery = `SELECT COUNT(*) AS totalCount FROM BOARD;`;

    db.query(countQuery, (err, countResult) => {
        if(err){
            res.status(500).json({ error: "카운트 조회 실패" });
            return;
        }

        const totalCount = countResult[0].totalCount;

        db.query(sqlQuery, [limit, offset], (err, listResult) => {
            if(err){
                res.status(500).json({ error: "목록 조회 실패" });
                return;
            }

            res.json({
                data: listResult,
                totalCount: totalCount,
            });
        });
    });
});

//read
app.post("/detail", (req, res) => {
//1.클라이언트로 부터 'id{1,2,3}'값을 요청 본문에서 가져옵니다
    const id = req.body.id;
//2) 주어진 id에 해당하는 게시글 정보를 조회합니다
const sqlQuery =
"SELECT BOARD_ID, BOARD_TITLE, BOARD_CONTENT FROM BOARD WHERE BOARD_ID = ?;";
//3)db.query를 사용하여 mysql데이터베이스에 쿼리를 실행합니다
db.query(sqlQuery,(err, result) => {
//4)쿼리 실행후에 에러가 발생하면 적절히 처리하거나 결과를 클라이언트에게 응답으로 보냅니다
res.send(result)    
})
})

//글쓰기
app.post("/insert",(req, res) => {
    const title = req.body.title;//새로운 글을 쓰는데 숫자가 자동으로 1증가하면서 타이틀과 내용을 mysql에서 레코드한다
    const content = req.body.title;

    const sqlQuery=
"INSERT INTO BOARD (BOARD_TITLE, BOARD_CONTENT, REGISTER_ID) VALUES (?, ?, '뽄지')"
db.query(sqlQuery,[title, content],(err, result) => {
    res.send(result);
});
});

//update 수정
app.post("/update", (req, res) =>{
    const id = req.body.id; //상수 id는 내가 수정하려 요청한 id
    const title = req.body.title;
    const content = req.body.content;

    const sqlQuery =
"UPDATE BOARD SET BOARD_TITLE = ?, BOARD_CONTENT = ?, UPDATER_ID='뽄지' WHERE BOARD_ID=?;";
db.query(sqlQuery,[title,content,id],(err, result) =>{
    //에러를 처리할 경우
    if(err){
        console.error("데이터베이스 수정중 에러발생", err);
        return res.status(500).send("내부오류이거나 오타가 발생함")
    }
    res.send(result);
});
});

//delete 삭제
app.post("/delete", (req, res) =>{
    const id = req.body.boardIdList; 
    //글을 삭제할때는 순번을 눌러서 삭제

    if(!Array.isArray(idList) || idList.length === 0){
//boardIdList 가 배열인지 확인 배열이 비어 있지 않은지도 확인
        return res.status(400).send("Invalid boardIdList");
        //유효하지 않은 경우 400 bad Request응답을 리턴
    }

    const placeholders = idList.map(() => '?').join(',');
    //idList.length만큼에 ?를 만들어 쿼리에 바인딩

    const sqlQuery =
`DELETE FROM BOARD WHERE BOARD_ID IN (${placeholders})`;
//sql인젝션을 방지하고 사용자 입력이 직접 문자열로 삽입되지 않고 안전하게 파라미터로 처리
db.query(sqlQuery,idList,(err, result) =>{
    //에러를 처리할 경우
    if(err){
        console.error("데이터베이스 삭제중 에러발생", err);
        return res.status(500).send("내부오류이거나 오타가 발생함")
    }
    res.send(result);
});
});


/*서버가 생겼는지 테스트  로컬호스트에 접속할때 실행하는대로 확인되는지 
app.get("/",(req, res) => {
const sqlQuery = "INSERT INTO requested (rowno) VALUES (1)";  
//rowno라는 칼럼에 숫자 1을 넣어주세요
db.query(sqlQuery, (err, result) =>{
res.send("성공");
});*/

//console.log("요청함")
//})
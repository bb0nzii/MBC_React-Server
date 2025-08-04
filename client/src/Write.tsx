import React, {useState, useEffect, useCallback} from "react";
//import {Component} from "react"; //클래스형일 때는 이렇게 선언
import {Form, Button, Container, Row, Col, ButtonGroup} from "react-bootstrap";
//react에서 api통신할때 사용하는 모듈 axios
import Axios from "axios"; //미들웨어
//write라는 페이지는 쓰기 페이지여서 이벤트 발생 1)글을 쓴다 2)성공 또는 실패

interface Iprops{
    isModifyMode: boolean;
    boardId: number;
    handleCancel:() => void;
    // ^^ void는 반환되는 값이 없음을 의미. 주로 모달닫기나 상태초기화
}

// class Write extends Component{
//     render(){
const Write: React.FC<Iprops> = ({isModifyMode, boardId, handleCancel}) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // vv 상태초기화
    // const [isModifyMode, setIsModifyMode] = useState(false); //수정모드 여부
    // //현재작성모드(false) 수정모드(true)인지를 나타냄
    // const [formData, setFormData] = useState({
    //     id:null, title: "", content: "",
    // }); //사용자가 입력한 제목과 내용을 상태로 관리

    // vv 입력 핸들러 : 폼의 name 속성(title, content)을 키로 사용하여 상태를 나타냄
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        // ^^ 이벤트 객체 e는 React.ChangeEvent타입이며 <HTMLInputElement | HTMLTextAreaElement>는 인풋 또는 텍스트아리아에서 발생하는 이벤트만 처리함을 의미 
        const {name, value} = e.target;
        // ^^ e.target은 이벤트가 발생한 dom요소 이 두 값을 추출하여 폼상태를 업데이트하는 데 사용
        if(name === "title") setTitle(value);
        else if(name === "content") setContent(value);

        // setFormData((prevData) => ({
        //     // ^^ setFormData는 폼데이터를 저장하는 상태 업데이트 함수
        //     ...prevData,
        //     // ^^ 이전 폼 데이터 상태 스프레드 연산자로 기존 데이터를 복사
        //     [name]: value,
        //     // ^^ 얘를 통해 해당 필드값만 업데이트
        // }));
    };

    //write
    const write = () => {
        Axios.post("http://localhost:8080/insert",{title, content})
        .then(() => {
            setTitle("");
            setContent("");
            handleCancel();
        }).catch((e) => console.error(e));
    };

    //update
    const update = () => {
        Axios.post("http://localhost:8080/update",{title, content, id:boardId})
        .then(() => {
            setTitle("");
            setContent("");
            handleCancel();
        }).catch((e) => console.error(e));
    };

    //detail
    const detail = useCallback(() => {
        Axios.get(`http://localhost:8080/detail?id=${boardId}`)
        .then((res) => {
            if(res.data.length > 0){
                setTitle(res.data[0].BOARD_TITLE);
                setContent(res.data[0].BOARD_CONTENT);
            }
        }).catch((e) => console.error(e));
    },[boardId]);

    useEffect(() => {
        if(isModifyMode){
            detail();
        }
    },[isModifyMode, boardId, detail]);

        return(
<>
<Container>
    <Row>
        <Col>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                    type="text" 
                    name="title"
                    value={title}
                    onChange={handleChange}
                    placeholder="제목을 입력하세요"
                    />
                </Form.Group>
                <Form.Group className="my-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                    as="textarea"
                    name="content"
                    value={content}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    />
                </Form.Group>
            </Form>

            <div className="">
                <div className="d-flex justify-content-end mt-4 mb-2">
                    <ButtonGroup>
                        <Button variant="primary"
                        onClick={isModifyMode ? update : write}
                        >완료</Button>
                        <Button variant="danger"
                        onClick={handleCancel}
                        >취소</Button>
                    </ButtonGroup>
                </div>
            </div>
        </Col>
    </Row>
</Container>            
</>           
        )
}


export default Write;

/*
//상태 초기화를 해줌
state = {
    isModifyMode : false,//수정모드는 허용하지 않음
title:"",//타이틀 비우고
content:"",//내용 비우고
}

//write 를 실행하는 함수 작성 get기존에 있는 내용을 리턴 
//쓰는 명령어를 줄때는 일반적으로 post사용 
write = () => {
    Axios.post("http://")
}
*/
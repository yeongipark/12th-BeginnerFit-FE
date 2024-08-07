import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { responsiveSize } from "../../utils/Mediaquery";
import { useState, useEffect, useContext, useRef } from "react";
import SetCategory from "../MyPage/SetCategory";
import { FormContext } from "./FormContext";
import api from "../../apis/axios";
import AlarmDialog from "../../styles/AlarmDialog";

export default function Page3() {
  const navigate = useNavigate();

  // page1,2,3 입력 데이터 받아오기 위한 전역 상태 함수
  const { formData, setFormData } = useContext(FormContext);

    //음수값 자릿수 제한
    const onInput = (e) => {
      if (Number(e.target.value) > 24) {
        e.target.value = 0;
        AlarmDialog({
          title: "하루 이내의 시간만 입력 가능합니다.",
          type: "warning",
        });
      } else if (e.target.value < 0) {
        e.target.value = 0;
        AlarmDialog({
          title: "음수값은 입력할 수 없습니다.",
          type: "warning",
        });
      }
    };
    
  //입력값 관리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    //setCategory 컴포넌트에서 선택된 카테고리가져오기
    const handleCategorySubmit = (selectedCategories) => {
      setFormData((prev) => ({ ...prev, categories: selectedCategories }));
    };

    // 버튼 활성화 & 유효성 검사
    const [allow, setAllow] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    // 폼 유효성 검사
    useEffect(() => {
      const {
      exerciseTime,
      categories,
      } = formData;
      //카테고리 유효성(각 카테고리별 1개이상은 선택) -> 제대로 작동 안되는 것 같음. 수정 필요.
      const isCategoriesValid = Object.values(categories).some(
        (arr) => arr.length > 0
      );
      //전체 유효성
      const isValid =
      exerciseTime>0 &&
      isCategoriesValid;
      setIsFormValid(isValid);      
    }, [formData]);

    // 버튼 활성화
    useEffect(()=>{
      if(isFormValid){
        setAllow(true);
        return;
      }
      setAllow(false);
    },[ isFormValid ]);


    const categoryName = ["exerciseIntensity", "exerciseGoals", "concernedAreas"];
    // formData.categories의 값을 categoryName 배열과 매핑
    const setCategory = categoryName.reduce((acc, key, idx) => {
        const formKey = Object.keys(formData.categories)[idx]; // formData.categories의 키 값을 가져옴
        acc[key] = formData.categories[formKey] || [];
        return acc;
    }, {});
    //폼 가공하기
    const initialForm = {
        email: formData.email,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        targetWeight: parseFloat(formData.targetWeight),
        date: formData.date,
        targetDate: formData.targetDate,
        exerciseTime: parseInt(formData.exerciseTime)*60, //시간으로 받은 데이터 값 -> 분 단위로 변경
        exerciseIntensity: setCategory["exerciseIntensity"],
        exerciseGoals: setCategory["exerciseGoals"],
        concernedAreas: setCategory["concernedAreas"],
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (allow){
            try{
                const userLoginResponse = await api.post("/auth/sign-up", {
                    email: formData.email,
                    name: formData.name,
                    password: formData.password
                });
            
                //유저 정보 등록 후 건강 정보 등록 기능 실행되도록 함.
                    const userHealthResponse = await api.put("/users/health-info", initialForm);
                    AlarmDialog({
                      title: "회원가입 성공!",
                      type: "success",
                    });
                    navigate("/"); //로그인 페이지로 이동
                
            } catch(error){
                AlarmDialog({
                  title: "회원가입 실패",
                  content: error.response?.data?.message || "서버 에러",
                  type: "error",
                });
            }
        }
    };

    const formRef = useRef(null);
    const handleButtonClick = (e) => {
        e.preventDefault();

        // 폼 수동 제출
        if (isFormValid) {
            handleSubmit(e);
        }
    };
    return(
        <Wrapper>
            <Box>
                <H1>
                    하루 운동 시간과
                    <br/>
                    운동 목표를 설정해주세요.
                </H1>
                <Form 
                ref={formRef} 
                onSubmit={handleSubmit}
                >
                    <TextInputContainer>
                        <P>운동시간</P>
                        <SubContainer>
                            <Input
                                type="number"
                                onInput={onInput}
                                name="exerciseTime"
                                value={formData.exerciseTime}
                                onChange={handleInputChange}
                            ></Input>
                            <P>시간</P>
                        </SubContainer>
                    </TextInputContainer>
                    <SetCategory onSubmit={handleCategorySubmit} isSignUp={true}></SetCategory>
                </Form>
                <SignUpButton 
                    type="button" 
                    disabled={!allow}
                    onClick={handleButtonClick}
                >
                    시작하기
                </SignUpButton>
            </Box>
        </Wrapper>
  );
}

const Wrapper = styled.div`
    display: flex;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.white};
    border: solid 1px ${({ theme }) => theme.colors.gray04};
`
const Box = styled.form`
  display: grid;
  justify-content: center;
  align-items: flex-start;
  width: 600px;
  margin: 0px auto;
`;

const Form = styled.form`
  width: 500px;
  border-radius: 15px;
`;

const H1 = styled.h1`
  margin-top: 80px;
  @media (max-width: 480px) {
    font-size: ${responsiveSize("24")};
  }
`;

const P = styled.p`
  margin-top: 15px;
  padding-left: 10px;
  margin-bottom: ${responsiveSize(9)};
`;

const TextInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-right: ${responsiveSize(30)};
  @media (max-width: 480px) {
    margin-right: ${responsiveSize(16)};
  }
`;

const Input = styled.input`
  width: ${responsiveSize(120)};
  padding: 13px;
  font-size: ${responsiveSize("16")};
  border: none;
  font-weight: 400;
  border-radius: ${responsiveSize("12")};
  background-color: ${({ theme }) => theme.colors.gray01};
  @media (max-width: 480px) {
    width: ${responsiveSize(90)};
    height: ${responsiveSize(30)};
    font-size: ${responsiveSize(15)};
  }
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const SignUpButton = styled.button`
  align-items: flex-end;
  width: 100%;
  height: ${responsiveSize(60)};
  background-color: #653eff;
  color: white;
  font-size: ${responsiveSize("20")};
  padding: 15px;
  margin-top: 50px;
  border-radius: 10px;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    background-color: #9a9a9a;
  }
`;


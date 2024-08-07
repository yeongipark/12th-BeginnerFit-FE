import axios from "axios";
import api from "./axios";
import AlarmDialog from "../styles/AlarmDialog";

export const updateEditUserInfo = async (form, email) => {
  //이메일 Zustand에서 가져오기

  //const categoryName = ["concernedAreas", "exerciseIntensity", "exerciseGoals"];
  const categoryName = ["exerciseIntensity", "exerciseGoals", "concernedAreas"];

  // form.categories의 값을 categoryName 배열과 매핑
  const setCategory = categoryName.reduce((acc, key, idx) => {
    const formKey = Object.keys(form.categories)[idx]; // form.categories의 키 값을 가져옴
    acc[key] = form.categories[formKey] || [];
    return acc;
  }, {});

  //폼 가공하기
  const initialForm = {
    email: email,
    height: parseFloat(form.height),
    weight: parseFloat(form.weight),
    targetWeight: parseFloat(form.targetWeight),
    date: form.date,
    targetDate: form.targetDate,
    exerciseTime: parseInt(form.exerciseTime)*60,
    exerciseIntensity: setCategory["exerciseIntensity"],
    exerciseGoals: setCategory["exerciseGoals"],
    concernedAreas: setCategory["concernedAreas"],
  };
  
  try {
    const response = await api.put("/users/health-info", initialForm);
    AlarmDialog({
      text:"회원님의 정보가 수정되었습니다.",
      title: "정보 수정",
      type: "info",
    });
  } catch (error) {
    AlarmDialog({
      title: "오류가 발생했습니다.",
      type: "error",
    })
    
   
  }
};

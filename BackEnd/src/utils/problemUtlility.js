import axios from "axios";

const getlanguageVersion = { 
  java : "15.0.2",
  python: "3.10.0",
  cpp : "10.2.0",
}

export const getLanguageVersion = (language) => {
  return getlanguageVersion[language]
}

export const compileCode = async(payload) =>{
    try {
        const response = await axios.post(process.env.PROBLEM_API,payload)
        return response.data
    } catch (error) {
        console.log("Error is : " + error)
    }
}
import axios from "axios";


export const compileCode = async (payload) => {
  try {
    const response = await axios.post(process.env.COMPILER_API, payload)
           //  console.log(response.data)
    return response.data
  } catch (error) {
    console.log("Error is : " + error)
  }
}
import axios from "axios";


export const compileCode = async (payload) => {
  try {
   // console.log(payload)
    const response = await axios.post("https://api.onlinecompiler.io/api/run-code-sync/", payload, {
      headers: {
        'Authorization': process.env.ONLINE_COMPILER_API_KEY,
        'Content-Type': 'application/json'
      }
    });
   // console.log(response.data)
    return response.data
  } catch (error) {
    console.log("Error is : " + error)
    return null;
  }
}
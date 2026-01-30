import { getLanguageVersion, compileCode } from "../utils/problemUtlility.js";
import Problem from "../models/problem.js";
export const createProblem = async (req, res) => {
    try {
        if (req.result.role !== "admin")
            throw new Error("Invalid Credentials")

        // console.log(req.body)

        const { title, description, difficulty, tags, visibleTestCases
            , hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body


        for (const { language, completeCode } of referenceSolution) {
            const version = getLanguageVersion(language)
            const payload = {
                language: language,
                version: version,
                files: [
                    {
                        content: completeCode
                    }
                ],
                stdin: visibleTestCases[0].input,
            }
          //  console.log(payload)
            const response = await compileCode(payload)



           // console.log(response)

            if (response.run.signal != null || response.run.code != 0 || response.run.stdout == ""
                || response.run.stderr != "") {
                res.status(400).send("Error Occured in Creating Problem")
            }
            if (response.run.stdout == "Not Matched") {
                res.status(400).send("Error Occured in Creating Problem not matched")
            }


            const problem = await Problem.create({
                ...req.body,
                problemCreator: req.result._id
            })

            res.status(200).send("Problem Created Successfully")

        }


    } catch (error) {
        res.status(500).send("Error Occured in Creating Problem = " + error)
    }
}

import { getLanguageVersion, compileCode } from "../utils/problemUtlility.js";
import Problem from "../models/problem.js";
export const createProblem = async (req, res) => {
    try {
        if (req.result.role !== "admin")
            throw new Error("Invalid Credentials")

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
            const response = await compileCode(payload)

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

export const updateProblem = async (req, res) => {
   try { 
      if( req.result.role !== 'admin')
        throw new Error("Invalid Credentials")

    const {id} = req.params;
        if(!id){
        return res.status(400).send("Missing ID Field");
        }

      const { title, description, difficulty, tags, visibleTestCases
            , hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body 

       const problem = await Problem.findById(id);

       if(!problem)
        return res.status(404).send("ID is not persent in server");
       
       const update = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true})
       
       res.send("Updated Successfully")


   } catch (err){
      res.send("Error in Updating Problem " + err);
   }
}

export const deleteProblem = async (req , res) => {
    try {
        if( req.result.role !== 'admin')
        throw new Error("Invalid Credentials")

        const {id} = req.params;

        const deleted = await Problem.findByIdAndDelete(id);

        if(!deleted)
            res.send("Deletion Failed")

        res.send("Deleted Successfully")


    } catch (err){
        res.send("Error during Deletion " + err)
    }
}

export const getProblemById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
        return res.status(400).send("Missing ID Field");
        }

        const problem = await findById(id);

        if(!problem)
            res.send("Problem Not Found")

        res.send(problem)

    } catch (err) {
            res.send("Error in fetching Problem " + err)
    }
}

export const getAllProblem = async (req,res) => {
        try {

        const problems = await find({s});

        if(problem.length == 0)
            res.send("Problems are missing")

        res.send(problems)

    } catch (err) {
            res.send("Error in fetching Problems " + err)
    }
}

// export const solvedAllProblemByUser = async (req,res) => {
//     try {


//     } catch (err) {

//     }
// }


import validator from "validator";

export const validate = (data) => {

    if( !validator.isEmpty(data.name))
        throw new Error("Invalid Credentials")

    if(!validator.isEmail(data.email))
        throw new Error("Invalid Credentials")

    if(!validator.isStrongPassword(data.password))
        throw new Error("Invalid Credentials")

}
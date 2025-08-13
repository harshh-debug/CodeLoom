import validator from "validator"

export const validateUserInput = (data) => {
    const mandatoryFields = ['firstName', 'emailId', 'password'];
    const isAllowed= mandatoryFields.every(field => Object.keys(data).includes(field));
    if(!isAllowed) {
        throw new Error("Missing mandatory fields");
    }
    if(!validator.isEmail(data.emailId)) {
        throw new Error("Invalid email format");
    }
    if(!validator.isStrongPassword(data.password)) {
        throw new Error("Password does not meet strength requirements");
    } 
    if(!validator.isAlpha(data.firstName)) {
        throw new Error("First name should only contain letters");
    }
    if(data.firstName.length < 3 || data.firstName.length > 20) {
        throw new Error("First name should be between 3 and 20 characters");
    }
}
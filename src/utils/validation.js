import validator from 'validator';

export const validateSignUpData = (req) => {
    const {firstName , lastName,  emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("FirstName and LastName Cannot be Empty.");
    }
    else if(firstName.length < 3 || firstName.length > 20){
        throw new Error("FirstName should be between 3 to 20 characters");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email Format");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Min 8 chars, at least 1 lowercase, 1 uppercase, 1 number, 1 special (!@#$%^&*). No spaces allowed.");
    }
}


export const validateEditProfileData = (req) => {   
    const ALLOWED_UPDATES = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "password",
        "about",
        "age",
        "gender",
        "skills",
    ];

    const isUpdateAllowed = Object.keys(req.body).every((field) => 
        ALLOWED_UPDATES.includes(field)
    );
    if(!isUpdateAllowed){
        throw new Error("Update not allowed on this field");
    }   
    else if(req.body?.about){
        const wordCount = req.body.about.trim().split(/\s+/).length; // Count words
        if(wordCount > 70){
            throw new Error("The 'about' section cannot exceed 70 words.");
        }
      
    }
    return isUpdateAllowed;
};



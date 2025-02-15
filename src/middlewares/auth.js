export const adminAuth = (req, res, next) => {
    console.log("admin auth middleware");
    const token="xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    
    }
};
export const userAuth = (req, res, next) => { 
    console.log("user auth is getting called");
    const token="xyz";
    const isUserAuthorized = token === "xyz";
    if(!isUserAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    } 
};

 



export async function getUsers() {
    try {
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();
        return users;
    }catch (error){
        console.log(error);
    }
    
}

export async function getCourses() {
    try {
        const res = await fetch("http://localhost:3000/courses");
        const courses = await res.json();
        return courses;
    }catch (error){
        console.log(error);
    }
    
}
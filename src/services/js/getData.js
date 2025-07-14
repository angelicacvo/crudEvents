

export async function getUsers() {
    try {
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();
        return users;
    }catch (error){
        console.log(error);
    }
    
}

export async function getEvents() {
    try {
        const res = await fetch("http://localhost:3000/events");
        const events = await res.json();
        return events;
    }catch (error){
        console.log(error);
    }
    
}
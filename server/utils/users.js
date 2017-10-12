
class Users {
    constructor(){
        this.users = [];
    }

    addUser (id, name) {
        const user = {id, name};
        this.users.push(user);
        return user;
    }

    getUser(id){
        var user = this.users.filter((user) => user.id === id )[0];
        return user;
    }
    
    userExist(name){
        var user = this.users.filter((user) => user.name === name)[0];
        if(user){
            return true;
        }
       return false;
    }

    removeUser(id){
        var user = this.getUser(id);
        if (user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    
}


module.exports = {Users};

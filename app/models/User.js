class User {
    constructor(id, email, name, userType = 'customer') {
      this.id = id;
      this.email = email;
      this.name = name;
      this.userType = userType;
    }
  
    toJSON() {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
        userType: this.userType
      };
    }
  
    static fromFirestore(doc) {
      const data = doc.data();
      return new User(doc.id, data.email, data.name, data.userType);
    }
  }
  
  export default User;
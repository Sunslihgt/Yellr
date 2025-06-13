class Auth {
    email: string;
    passwordHash: string;

    constructor(
        email: string,
        passwordHash: string
    ) {
        this.email = email;
        this.passwordHash = passwordHash;
    }
}

export default Auth;
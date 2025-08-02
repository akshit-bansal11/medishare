// Simple email rule
export function isEmailValid(email) {
    return email.includes('@') && email.includes('.');
}

// Individual password rules
export function has8Chars(password) {
    return password.length >= 8;
}

export function hasNumber(password) {
    return /[0-9]/.test(password);
}

export function hasUpper(password) {
    return /[A-Z]/.test(password);
}

export function hasLower(password) {
    return /[a-z]/.test(password);
}

export function hasSymbol(password) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

// All together
export function isPasswordValid(password) {
    return (
        has8Chars(password) &&
        hasNumber(password) &&
        hasUpper(password) &&
        hasLower(password) &&
        hasSymbol(password)
    );
}

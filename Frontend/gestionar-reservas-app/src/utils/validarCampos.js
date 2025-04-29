export function checkEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email);
}

/* La password debería cumplir cierto patron */
/* Debe contener minusculas, mayusculas y numeros */
export function checkPassword(password) {
    return password.length >= 5;
}
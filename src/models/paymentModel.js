export function paymentIdGenerator(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let generatedCode = "";
    for (let i = 0; i < length; i++){
        const randomLetter = Math.floor(Math.random() * characters.length);
        generatedCode += characters[randomLetter];
    }
    return generatedCode;
}
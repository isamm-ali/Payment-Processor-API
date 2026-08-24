export function customerIdGenerator(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let generatedCode = "";
    for (let i = 0; i < length; i++){
        const randomLetter = Math.floor(Math.random() * characters.length);
        generatedCode += characters[randomLetter];
    }
    return generatedCode;
}
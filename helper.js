//helper functions 
//function to generate random string 
function generateRandomString(numOfChars) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < numOfChars; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
//function to fetch user by ID
const getUserById = (userId, users) => {
    const user = users[userId];
    if (user) {
        return user;
    }
    return null;
};
//function that compares user id to database
const urlsForUser = (id, urlDatabase) => {
    let userURLdata = {};
    for (const url in urlDatabase) {
        if (id === urlDatabase[url].userID) {
            userURLdata[url] = urlDatabase[url];
        }
    }
    return userURLdata;
};
//function to looklup user email
const getUserByEmail = function (email, userdatabase) {
    for (let user in userdatabase) {
        if (userdatabase[user].email === email) {
            return userdatabase[user];
        }
    }
    return undefined;
};
//exportfunctions
module.exports = { generateRandomString, getUserById, urlsForUser, getUserByEmail };
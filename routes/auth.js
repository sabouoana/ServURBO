const jwt = require('jsonwebtoken');
const db = require('../app');
const { executeQuery } = require('../db');
const bcrypt = require('../utilities/bcrypt');
const wrongUserPassMsg = 'Incorrect username and/or password.'
const secret = 'secret';

module.exports = {
    generareToken,
    login,
    test
}

function generareToken(ctx) {

    const payload = { sub: 1 };
    //sub este de obicei ID sau username, ceva unic cu care se identifica un utilizator
    const token = jwt.sign(payload, secret);
    //payload- ce dorim sa stocam in token
    //secret- o cheie secreta cu care se semneaza tokenul 
    //doar serverul o sa stie aceasta cheie secreta
    ctx.body = token;
};


function test(ctx) {
    ctx.body = ctx.request.jwtPayload;
}

async function login(ctx) {
    const { username, password } = ctx.request.body.login;
    console.log(username, password);

    if (!username) ctx.throw(422, 'Username required.');
    else ctx.body = 'OK';

    if (!password) ctx.throw(422, 'Password required.');
    else ctx.body = 'OK';



    const dbUser = await executeQuery({
        text: `select id, password from users where username = $1`,
        values: [username]
    })

    if (!dbUser) {
        ctx.throw(401, 'No such user.');
        ctx.body = 'Nu exista useri';
    }
    if (await bcrypt.compare(password, dbUser[0].password)) {
        const payload = { sub: dbUser.id };
        const token = jwt.sign(payload, secret);
        ctx.body = { token };
        console.log(token);
    } else {
        ctx.throw(401, wrongUserPassMsg);
    }


};


//https://travishorn.com/api-server-with-jwt-authentication-6bb4985c5253
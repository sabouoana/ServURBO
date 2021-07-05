// app.js

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');
const koaRouter = require("koa-router");
const errorHandler = require('./middleware/errorHandler');
const authenticated = require('./middleware/authenticated');
const authRoute = require('./routes/auth');
// const petsRoute = require('./routes/pets');
const koaBody = require('koa-body');
const bcrypt = require('./utilities/bcrypt');
const cors = require('@koa/cors');
const { executeQuery } = require('./db/index');
const { pool } = require('./db/index');

const app = new Koa();



bcrypt.hash('parola').then(hash => console.log(hash));
app.use(bodyParser());
app.use(errorHandler);
// app.use(authenticated);
app.use(cors());

// app.use(petsRoute);

// create app instance
const router = new koaRouter();
router.post('/login', bodyParser(), authRoute.login);
router.get('/test', authenticated, authRoute.test);

// router.get('/my-pets', authenticated, petsRoute);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);


router.post('/saveCoordinates', koaBody(), (ctx) => {
    console.log(ctx.request.body);

    const longitude = ctx.request.body.marker.longitude;

    console.log(longitude);

    executeQuery({
        text: "INSERT INTO markers(longitude, latitude, type) VALUES($1, $2, $3)",
        values: [ctx.request.body.marker.longitude, ctx.request.body.marker.latitude, ctx.request.body.marker.id]

    })


});

// (async() => {
//     const users = await executeQuery({
//         text: `select * from users`,
//         values: []
//     });

//     const oana = await executeQuery({
//         text: `select * from users where username = $1;`,
//         values: ['oana']
//     });

//     console.log({ users, oana });

// })()



// db.connect()
//     .then((client) => {
//         client.query(query)
//             .then(res => {
//                 for (let row of res.rows) {
//                     console.log(row);
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//             });
//     })
//     .catch(err => {
//         console.error(err);
//     });

app.use(async ctx => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    ctx.body = ctx.request.body;
});




router.get('/getCoordinates', koaBody(), ctx => {

    let db = executeQuery({
        text: 'select * FROM markers WHERE id = $1',
        values: [id]
    })
    ctx.body = db;
    console.log(db);
})


router.post('/saveDetails', koaBody(), ctx => {
    const txt = ctx.request.body.popup.txtDetails;
    console.log(txt);

})


// router.post('/login', koaBody(), ctx => {
//     console.log(ctx.request.body);

//     const username = ctx.request.body.login.username;
//     const password = ctx.request.body.login.password;


//     console.log(username);

//     if (!username) ctx.throw(422, 'Username required.');
//     else ctx.body = 'OK';

//     if (!password) {
//         ctx.throw(422, 'Password required.');
//     } else ctx.body = 'OK';


//     const dbUser = executeQuery({
//         text: `select * from users where username=$1 and password=$2`,
//         values: [username, password]
//     })

//     // const dbUser = await db.first(['id', 'password'])
//     //     .from('users')
//     //     .where({ username });
//     if (!dbUser) {
//         ctx.throw(401, 'No such user.');
//         ctx.body = 'Nu exista useri';
//     }
//     console.log('tzapa');


//     pool.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
//         if (err) {
//             throw err
//         }

//         if (password == res.rows[0].password) {
//             console.log('e ok');

//         } else {
//             console.log('nu e ok');
//         }

//     })
// });


// router.post('/api/login', koaBody(), ctx => {
//     console.log(ctx.requeste.body.login.username);
//     const { username, password } = ctx.request.body;

//     if (!username) ctx.throw(422, 'Username required.');
//     else ctx.body = 'OK';

//     if (!password) ctx.throw(422, 'Password required.');
//     else ctx.body = 'OK';



//     const dbUser = executeQuery({
//             text: `select id, password from users where username = $1`,
//             values: [username]
//         })
//         // const dbUser = await db.first(['id', 'password'])
//         //     .from('users')
//         //     .where({ username });
//     if (!dbUser) {
//         ctx.throw(401, 'No such user.');
//         ctx.body = 'Nu exista useri';
//     }
//     if (password === dbUser[0].password) {
//         /* Sign and return the token just like before
//          * except this time, sub is the actual database
//          * user ID. */
//         const payload = { sub: dbUser[0].id };
//         const token = jwt.sign(payload, secret);
//         ctx.body = token;
//     } else {
//         ctx.throw(401, 'Incorrect password.');
//     }

// });



app.use(router.routes());

// app.use(bodyParser.urlencoded({
//     extended: true
// }));



//https://www.youtube.com/watch?v=RSJxWJ6dCL4&ab_channel=CodeHandbookCodeHandbook
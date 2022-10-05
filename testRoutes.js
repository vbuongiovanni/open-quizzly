const axios = require("axios");
const jwt_decode = require("jwt-decode");

const body = {
  username : "peteDavidasdfsa" + Math.round(Math.random()*(1000000000000)),
  password : "test123",
  confirmPassword : "test123"
};

let token;

const testSignUp = (body) => {
  axios.post("http://localhost:9000/auth/signup", body)
    .then(res => res.data)
    .then(data => {
      console.log({
        Type : "signup",
        reqUsername : body.username.toLowerCase(),
        resUsername : data.user.username,
        Match : body.username.toLowerCase() === data.user.username
      })
    })
    .catch(err => console.log({statusCode : err.response.status, errMsg : err.response.data.errMsg}))
};

const testLogin = (body) => {
  axios.post("http://localhost:9000/auth/login", body)
    .then(res => res.data)
    .then(data => {
      token = data.token;
      console.log({
        Type : "login",
        reqUsername : body.username.toLowerCase(),
        resUsername : data.user.username,
        Match : body.username.toLowerCase() === data.user.username
      })
    })
    .catch(err => console.log({statusCode : err.response.status, errMsg : err.response.data.errMsg}))
};

// sign up user:
testSignUp(body);

// log user in
setTimeout(() => {
  testLogin(body)
}, 1000);


setTimeout(() => {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  axios.get("http://localhost:9000/api/quiz", config)
    .then(res => console.log(res.data))

}, 2000);


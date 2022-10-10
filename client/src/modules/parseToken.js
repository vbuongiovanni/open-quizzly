import jwt_decode from "jwt-decode";

const parseToken = token => {
  const userObject = jwt_decode(token);
  return {username : userObject.username, userId : userObject._id};
}

export {parseToken}
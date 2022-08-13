function LoginPage() {
  return(
    <div>
      <div className="loginFormDiv">

        <form className="loginForm">
          Username
          <input type="text"></input>
          Password
          <input type="text"></input>

          <button className="loginButton">Login</button>

        </form>
      </div>
    </div>
  )
}

export default LoginPage
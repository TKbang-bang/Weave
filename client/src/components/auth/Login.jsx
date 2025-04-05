import React, { useState } from "react";
import { Eye, EyeSplash } from "../svg";

function Login() {
  const [seePassword, setSeePassword] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [emailErrTxt, setEmailErrTxt] = useState("Hello world");
  const [passwordErr, setPasswordErr] = useState(false);
  const [passwordErrTxt, setPasswordErrTxt] = useState("Hola mundo");

  return (
    <form>
      <h1>Log in</h1>

      <article className="email_field">
        <div className="email_conatainer">
          <label>Email</label>
          <input type="email" placeholder=" " maxLength={40} required />
        </div>
        {emailErr && <p className="error">*{emailErrTxt}</p>}
      </article>

      <article className="password_field">
        <div className="password_container">
          <label>Password</label>
          <input
            type={seePassword ? "text" : "password"}
            placeholder=" "
            maxLength={12}
            required
          />
          {seePassword ? (
            <span onClick={() => setSeePassword(false)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeePassword(true)}>
              <EyeSplash />
            </span>
          )}
        </div>

        {passwordErr && <p className="error">*{passwordErrTxt}</p>}
      </article>

      <button type="submit" className="btn">
        Log in
      </button>

      <a href="">have you forgotten your password?</a>
    </form>
  );
}

export default Login;

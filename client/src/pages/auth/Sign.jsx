import React from "react";
import Login from "../../components/auth/Login";
import Signup from "../../components/auth/Signup";

function Sign() {
  return (
    <div className="sign_container">
      <div className="sign">
        <div className="form_container login">
          <Login />
        </div>
        <div className="form_container signup">
          <Signup />
        </div>

        <div className="slider">
          <div className="slider_box slider_login">
            <div className="up">
              <h1>Welcome back user!</h1>
              <p>Don't forget to follow other users to see their posts</p>
            </div>

            <div className="down">
              <h3>Don't have an account?</h3>
              <button
                onClick={() =>
                  document.querySelector(".sign").classList.toggle("active")
                }
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="slider_box slider_signup">
            <div className="up">
              <h1>Hello new user!</h1>
              <p>
                Create a new account to follow other users, and share with your
                friends
              </p>
            </div>

            <div className="down">
              <h3>Already have an account?</h3>
              <button
                onClick={() =>
                  document.querySelector(".sign").classList.toggle("active")
                }
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sign;

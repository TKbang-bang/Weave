import React, { useEffect, useState } from "react";
// import { Eye, EyeSplash, SocialIllustration } from "../../components/svg.jsx";
import { Link, useNavigate } from "react-router-dom";
import { codeVerify } from "../../services/auth.js";

function Verify() {
  const [codeErr, setCodeErr] = useState(false);
  const [codeErrortxt, setCodeErrortxt] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCodeErr(false);
    setCodeErrortxt("");

    if (!code || code.length < 1) {
      setCodeErr(true);
      setCodeErrortxt("Invalid code");
    } else {
      try {
        setCodeErr(false);
        setCodeErrortxt("");

        const res = await codeVerify(code);
        if (!res.data.ok) throw new Error(res.response.data.message);
        navigate("/");
      } catch (error) {
        setCodeErr(true);
        setCodeErrortxt(error.response.data.message);
      }
    }
  };

  return (
    <div className="verify_container">
      <div className="verify">
        <div className="info_box">
          <h1>Verify your account</h1>
          <p>
            A verification code has been sent to your email, please enter the
            code to verify your account
          </p>
        </div>
        <div className="form_container">
          <form onSubmit={handleSubmit}>
            <article>
              <div>
                <label>Code</label>
                <input
                  type="text"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  placeholder=" "
                />
              </div>

              {codeErr && <p className="error">*{codeErrortxt}</p>}
            </article>

            <button className="btn">Verify code</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Verify;

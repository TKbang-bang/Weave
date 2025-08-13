import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { codeVerify } from "../../services/auth.js";
import { setAccessToken } from "../../services/token.service.js";
import { userIsLogged } from "../../services/global.js";

function Verify() {
  const [codeErr, setCodeErr] = useState(false);
  const [codeErrortxt, setCodeErrortxt] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyingUser = async () => {
      try {
        const res = await userIsLogged();

        if (res.status == 200) return navigate("/");
      } catch (error) {
        return;
      }
    };

    verifyingUser();
  }, []);

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

        if (res.status !== 200) throw new Error(res.data.message);

        setAccessToken(res.data.accessToken);
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

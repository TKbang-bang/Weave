import React, { useState } from "react";
import { Eye, EyeSplash } from "../../components/svg";
import { toast, Toaster } from "sonner";
import { changePassCode, forgotPassword } from "../../services/auth";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [two, setTwo] = useState(false);
  const navigate = useNavigate();

  const handleEmail = async (e) => {
    e.preventDefault();

    if (!email || email.length < 1) return toast.error("Email cannot be empty");

    setLoading(true);
    try {
      const res = await forgotPassword(email);

      if (!res.data.ok) throw new Error(res);

      toast.success(res.data.message);
      document.querySelector(".forgot_password").classList.add("active");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleCode = async (e) => {
    e.preventDefault();

    if (!code || code.length < 1) return toast.error("Code cannot be empty");
    if (!password || password.length < 1)
      return toast.error("Password cannot be empty");

    setLoading(true);
    try {
      const res = await changePassCode(code, password);

      if (!res.data.ok) throw new Error(res);

      setLoading(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="forgot_password_container">
      <div className="forgot_password">
        <form className="one" onSubmit={handleEmail}>
          <h1>A code will be sent to your email</h1>
          <div className="body">
            <div className="field_container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <button type="submit">Send mail</button>
            )}
          </div>
        </form>

        <form className="two" onSubmit={handleCode}>
          <h1>The code was sent to your email</h1>
          <div className="body">
            <div className="field_container">
              <label htmlFor="code">Code</label>
              <input
                type="text"
                id="code"
                placeholder=" "
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="field_container">
              <label htmlFor="password">New password</label>
              <input
                type={seePassword ? "text" : "password"}
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {loading ? (
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <button type="submit">Change password</button>
            )}
          </div>
        </form>
      </div>

      <Toaster position="top-center" richColors />
    </section>
  );
}

export default ForgotPassword;

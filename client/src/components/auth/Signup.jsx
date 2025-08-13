import React, { useState } from "react";
import { Eye, EyeSplash } from "../svg";
import { registerData } from "../../services/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [seePassword, setSeePassword] = useState(false);
  const [aliasErr, setAliasErr] = useState(false);
  const [aliasErrTxt, setAliasErrTxt] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [emailErrTxt, setEmailErrTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAliasErr(false);
    setAliasErrTxt("");
    setEmailErr(false);
    setEmailErrTxt("");
    setLoading(true);

    try {
      const res = await registerData(name, alias, email, password);

      if (res.status != 201) throw new Error(res);

      navigate("/verify");
    } catch (error) {
      if (error.response.data.about == "email") {
        setEmailErr(true);
        setLoading(false);
        setEmailErrTxt(error.response.data.message);
      }

      if (error.response.data.about == "alias") {
        setAliasErr(true);
        setAliasErrTxt(error.response.data.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign up</h1>

      <article className="name_field">
        <div className="name_container">
          <label>Name</label>
          <input
            type="text"
            placeholder=" "
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </article>

      <article className="alias_field">
        <div className="alias_container">
          <label>Alias</label>
          <input
            type="text"
            placeholder=" "
            value={alias}
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={15}
            required
          />
        </div>
        {aliasErr && <p className="error">*{aliasErrTxt}</p>}
      </article>

      <article className="email_field">
        <div className="email_container">
          <label>Email</label>
          <input
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        {emailErr && <p className="error">*{emailErrTxt}</p>}
      </article>

      <article className="password_field">
        <div className="password_container">
          <label>Password</label>
          <input
            type={seePassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </article>

      {loading ? (
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <button type="submit" className="btn">
          Sign up
        </button>
      )}
    </form>
  );
}

export default Signup;

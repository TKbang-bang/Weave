import React, { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeSplash } from "../../components/svg";
import { Toaster, toast } from "sonner";
import { getMyUser } from "../../services/usersServices";
import { changingEmail, sendingChangeEmailCode } from "../../services/updates";
import { useNavigate } from "react-router-dom";

function ChangeEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await getMyUser();

        if (!res.data.ok) throw new Error(res);

        setName(res.data.user.user_name);
        setNewName(res.data.user.user_name);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    getUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || email.length < 1) return toast.error("Email cannot be empty");
    if (!password || password.length < 1)
      return toast.error("Password cannot be empty");

    try {
      const res = await changingEmail(email, password);

      if (!res.data.ok) throw new Error(res);

      toast.success(res.data.message);
      document.querySelector(".updates_container").classList.add("active");

      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleCode = async (e) => {
    e.preventDefault();

    if (!code || code.length < 1) return toast.error("Code cannot be empty");

    try {
      const res = await sendingChangeEmailCode(code);

      if (!res.data.ok) throw new Error(res);

      toast.success(res.data.message);

      setTimeout(() => navigate("/settings"), 1000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="updates_container">
      <button className="back" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>
      <div className="one">
        <form onSubmit={handleSubmit}>
          <h1 className="title">Changing email</h1>

          <article className="field_container">
            <label htmlFor="email">New email</label>
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </article>

          <article className="field_container">
            <label htmlFor="password">Password</label>
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
          </article>

          {!loading ? (
            <button type="submit" className="btn">
              Change email
            </button>
          ) : (
            <div className=" btn loading">
              <span></span>
              <span></span>
              <span></span>
              {/* <span></span>
              <span></span>
              <span></span> */}
            </div>
          )}
        </form>
      </div>

      <div className="two">
        <form onSubmit={handleCode}>
          <h1 className="title">We sent you a code to your email</h1>

          <article className="field_container">
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              placeholder=" "
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </article>

          <button type="submit" className="btn">
            Verify
          </button>
        </form>
      </div>

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default ChangeEmail;

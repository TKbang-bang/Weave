import React, { useState } from "react";
import { ArrowLeft, Eye, EyeSplash } from "../../components/svg";
import { Toaster, toast } from "sonner";
import { ChangingPassword } from "../../services/updates";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeNew, setSeeNew] = useState(false);
  const [seeConf, setSeeConf] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 1)
      return toast.error("Password cannot be empty");
    if (!newPassword || newPassword.length < 1)
      return toast.error("New password cannot be empty");
    if (newPassword === password)
      return toast.error("New password cannot be the same as the old one");
    if (newPassword !== confirmPassword)
      return toast.error("New password and confirm password must be the same");

    try {
      const res = await ChangingPassword(password, newPassword);

      if (res.status != 204) throw new Error(res);

      toast.success("Password has been changed");

      navigate("/settings");
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  return (
    <section className="updates_container">
      <button className="back" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>
      <form onSubmit={handleSubmit}>
        <h1 className="title">Changing name</h1>

        <article className="field_container">
          <label htmlFor="password">Current password</label>
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

        <article className="field_container">
          <label htmlFor="newpassword">New password</label>
          <input
            type={seeNew ? "text" : "password"}
            id="newpassword"
            placeholder=" "
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {seeNew ? (
            <span onClick={() => setSeeNew(false)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeeNew(true)}>
              <EyeSplash />
            </span>
          )}
        </article>

        <article className="field_container">
          <label htmlFor="confpassword">Confirm new password</label>
          <input
            type={seeConf ? "text" : "password"}
            id="confpassword"
            placeholder=" "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {seeConf ? (
            <span onClick={() => setSeeConf(false)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeeConf(true)}>
              <EyeSplash />
            </span>
          )}
        </article>

        <button type="submit" className="btn">
          Change name
        </button>
      </form>

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default ChangePassword;

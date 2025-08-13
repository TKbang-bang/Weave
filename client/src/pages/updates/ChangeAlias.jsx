import React, { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeSplash } from "../../components/svg";
import { toast } from "sonner";
import { getMyUser } from "../../services/usersServices";
import { changingAlias } from "../../services/updates";
import { useNavigate } from "react-router-dom";

function ChangeAlias() {
  const [alias, setAlias] = useState("");
  const [newAlias, setNewAlias] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await getMyUser();

        if (res.status != 200) throw new Error(res);

        setAlias(res.data.user.alias);
        setNewAlias(res.data.user.alias);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    getUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newAlias || newAlias.length < 1)
      return toast.error("New alias cannot be empty");
    if (newAlias === alias)
      return toast.error("New alias cannot be the same as the old one");
    if (newAlias.endsWith(" "))
      return toast.error("New alias cannot end with a space");
    if (!password || password.length < 1)
      return toast.error("Password cannot be empty");

    try {
      const res = await changingAlias(newAlias, password);

      if (res.status != 204) throw new Error(res);

      toast.success("Alias has been changed");

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
        <h1 className="title">Changing alias</h1>

        <article className="field_container">
          <label htmlFor="alias">New alias</label>
          <input
            type="text"
            id="alias"
            placeholder=" "
            value={newAlias}
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            onChange={(e) => setNewAlias(e.target.value)}
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

        <button type="submit" className="btn">
          Change alias
        </button>
      </form>
    </section>
  );
}

export default ChangeAlias;

import React, { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeSplash } from "../../components/svg";
import { Toaster, toast } from "sonner";
import { getMyUser } from "../../services/usersServices";
import { changingName } from "../../services/updates";
import { useNavigate } from "react-router-dom";

function ChangeName() {
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
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

    if (!newName || newName.length < 1)
      return toast.error("New name cannot be empty");
    if (newName === name)
      return toast.error("New name cannot be the same as the old one");
    if (newName.endsWith(" "))
      return toast.error("New name cannot end with a space");
    if (!password || password.length < 1)
      return toast.error("Password cannot be empty");

    try {
      const res = await changingName(newName, password);

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
      <form onSubmit={handleSubmit}>
        <h1 className="title">Changing name</h1>

        <article className="field_container">
          <label htmlFor="name">New name</label>
          <input
            type="text"
            id="name"
            placeholder=" "
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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
          Change name
        </button>
      </form>

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default ChangeName;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteAccount, loginOut } from "../../services/auth";
import {
  removeAccessToken,
  setAccessToken,
} from "../../services/token.service";

function Settings() {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const res = await loginOut();

      if (res.status != 204) throw new Error(res);

      setAccessToken(null);
      removeAccessToken();

      navigate("/sign");
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    toast("Are you sure you want to delete your account?", {
      action: {
        label: "Yes, delete my account",
        onClick: async () => {
          try {
            const res = await deleteAccount();

            if (res.status != 204) throw new Error(res.response.data.message);

            setAccessToken(null);
            removeAccessToken();

            navigate("/sign");
            window.location.reload();
          } catch (error) {
            toast.error(error.response.data.message);
          }
        },
      },
    });
  };

  return (
    <section className="settings_container">
      <div className="settings">
        <h1>Settings</h1>

        <article className="changes">
          <h3>User updates</h3>

          <ul className="changes_list">
            <li>
              <Link to={"/settings/update/name"}>Change name</Link>
            </li>
            <li>
              <Link to={"/settings/update/alias"}>Change alias</Link>
            </li>
            <li>
              <Link to={"/settings/update/email"}>Change email</Link>
            </li>
            <li>
              <Link to={"/settings/update/password"}>Change password</Link>
            </li>
          </ul>
        </article>

        <article className="log">
          <h3>Account log and delete</h3>

          <ul className="log_list">
            <li className="log_out">
              <button onClick={handleLogOut}>Log out</button>
            </li>
            <li className="delete_account">
              <button onClick={handleDelete}>Delete account</button>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default Settings;

import React from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { deleteAccount, loginOut } from "../../services/auth";

function Settings() {
  const handleLogOut = async () => {
    try {
      const res = await loginOut();

      if (!res.data.ok) throw new Error(res);

      toast.success(res.data.message);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
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

            if (!res.data.ok) throw new Error(res.response.data.message);

            toast.success(res.data.message);

            setTimeout(() => {
              window.location.reload();
            }, 1000);
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
              <Link to={"/settings/changename"}>Change name</Link>
            </li>
            <li>
              <Link to={"/settings/changealias"}>Change alias</Link>
            </li>
            <li>
              <Link to={"/settings/changeemail"}>Change email</Link>
            </li>
            <li>
              <Link to={"/settings/changepassword"}>Change password</Link>
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

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default Settings;

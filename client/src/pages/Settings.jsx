import React from "react";
import { Link } from "react-router-dom";

function Settings() {
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
              <Link>Change email</Link>
            </li>
            <li>
              <Link>Change password</Link>
            </li>
          </ul>
        </article>

        <article className="log">
          <h3>Account log and delete</h3>

          <ul className="log_list">
            <li className="log_out">
              <button>Log out</button>
            </li>
            <li className="delete_account">
              <button>Delete account</button>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default Settings;

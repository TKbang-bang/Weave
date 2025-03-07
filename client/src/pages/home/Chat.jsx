import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles.module.css";
import { ArrowLeft, SendIcon } from "../../components/svg";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Chat() {
  const { user_id } = useParams();
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/mychats/" + user_id)
      .then((res) => {
        setUser(res.data.user);
        setMessages(res.data.messages);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    socket.on("server_message", (data) => {
      // const temp = messages;
      // temp.unshift(data);

      // setMessages(temp);

      console.log(data);
      setMessage("");
    });
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    message != "" &&
      axios
        .get("/user_id")
        .then((res) => {
          socket.emit("client_message", {
            from_user_id: res.data.user_id,
            to_user_id: user_id,
            message: message,
          });
        })
        .catch((err) => console.log(err));
  };

  return (
    <section className={styles.chat}>
      <article className={styles.chat_container}>
        <article className={styles.chat_header}>
          <span className={styles.back} onClick={() => history.back()}>
            <ArrowLeft />
          </span>

          <div className={styles.user}>
            <img
              src={
                user.user_profile
                  ? `http://localhost:3000/uploads/${user.user_profile}`
                  : `../../../public/no_user.png`
              }
              alt=""
            />

            <h3>
              {user.user_name} {user.user_lastname}
            </h3>
          </div>
        </article>
        <article className={styles.chat_body}>
          <form className={styles.chat_form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">
              <SendIcon />
            </button>
          </form>

          {/* {console.log(messages)} */}
        </article>
      </article>
    </section>
  );
}

export default Chat;

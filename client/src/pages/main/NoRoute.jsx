import React from "react";
import { ArrowLeft } from "../../components/svg";
import { useNavigate } from "react-router-dom";

function NoRoute() {
  const navigate = useNavigate();

  return (
    <section className="no_route">
      <span className="back" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </span>

      <h1>404</h1>
      <p>Page not found</p>
    </section>
  );
}

export default NoRoute;

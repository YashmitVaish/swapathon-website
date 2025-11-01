import React, { useEffect } from "react";

function HomePage2() {
  useEffect(() => {
    // dynamically load the CodePen embed script
    const script = document.createElement("script");
    script.src = "https://public.codepenassets.com/embed/index.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div>
      <p
        className="codepen"
        data-height="300"
        data-default-tab="html,result"
        data-slug-hash="QNVzLb"
        data-pen-title="SAMURAI MORPH"
        data-user="73tk"
        style={{
          height: "300px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid",
          margin: "1em 0",
          padding: "1em"
        }}
      >
        <span>
          See the Pen{" "}
          <a href="https://codepen.io/73tk/pen/QNVzLb">SAMURAI MORPH</a> by{" "}
          <a href="https://codepen.io/73tk">@73tk</a> on{" "}
          <a href="https://codepen.io">CodePen</a>.
        </span>
      </p>
    </div>
  );
}

export default HomePage2;

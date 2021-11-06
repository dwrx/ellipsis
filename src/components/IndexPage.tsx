import { useEffect } from "react";

import "../miso.css";

function IndexPage() {
  useEffect(() => {
    document.body.className = "miso";
    document.documentElement.className = "miso";
    return () => {
      document.body.className = "";
      document.documentElement.className = "";
    };
  });

  return <h1>Miso One.</h1>;
}

export default IndexPage;

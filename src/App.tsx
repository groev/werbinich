import { useState } from "react";

import styles from "./App.module.css";

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch("https://gpt.westhofen.me/gpainter.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.text();
      console.log(data);

      setIsLoading(false);
      return setImage(data);
    } catch (e) {
      setIsLoading(false);
      setError("Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.layout}>
        <div
          className={styles.canvas}
          dangerouslySetInnerHTML={{ __html: image }}
        ></div>

        <form onSubmit={submit} className={styles.formElement}>
          <label className={styles.label} htmlFor="input">
            Was möchtest du zeichnen?
          </label>
          <input
            id="input"
            className={styles.input}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
          />
          <button className={styles.button} type="submit">
            {isLoading ? "Zeichnet..." : "Los geht's"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";

import styles from "./App.module.css";

type GPTMessage = {
  role: "user" | "bot";
  content: string;
};

function App() {
  const [person, setPerson] = useState<string>("");
  const [messages, setMessages] = useState<GPTMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch("https://gpt.westhofen.me/werbinich.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });
      const data = await response.text();
      setIsLoading(false);
      return setCurrentQuestion(data);
    } catch (e) {
      setIsLoading(false);
      setError("Ein Fehler ist aufgetreten.");
    }
  };

  const answerQuestion = async (text: string) => {
    setIsLoading(true);
    const newMessages = [
      ...messages,
      { role: "assistant", content: currentQuestion },
      { role: "user", content: text },
    ] as GPTMessage[];
    setMessages(newMessages);
    try {
      const response = await fetch("https://gpt.westhofen.me/werbinich.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.text();
      setIsLoading(false);
      return setCurrentQuestion(data);
    } catch (e) {
      setIsLoading(false);
      setError("Ein Fehler ist aufgetreten.");
    }
  };
  if (currentQuestion?.includes("Danke")) {
    return (
      <div className={styles.app}>
        <div className={styles.layout} style={{ textAlign: "center" }}>
          <h1 className={styles.question}>{currentQuestion}</h1>
          <button
            type="button"
            className={styles.button}
            onClick={() => window.location.reload()}
          >
            Nochmal!
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.headline}>GPT Wer bin ich</h1>
        <form onSubmit={submit} className={styles.formElement}>
          {currentQuestion ? (
            <div>
              <div className={styles.question}>{currentQuestion}</div>
              {isLoading ? (
                <div className={styles.think}>Denkt nach...</div>
              ) : (
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => answerQuestion("Nein")}
                  >
                    Nööö
                  </button>

                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => answerQuestion("Ja")}
                  >
                    Jupp
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <label className={styles.label} htmlFor="input">
                Welche berühmte Persönlichkeit bist du?
              </label>
              <input
                autoComplete="off"
                id="input"
                className={styles.input}
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                type="text"
              />
              {isLoading ? (
                <div>Hmmmm ...</div>
              ) : (
                <button className={styles.button} type="submit">
                  Los geht's
                </button>
              )}
            </>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <div className={styles.footer}>
          Made with ❤️ by <a href="https://www.westhofen.me">westhofen.me</a>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    // Make a request to the ChatGPT API with the user input

    setLoading(true);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a dungeon master, can you describe to me the next messages I'll send you like one? Please limit it to one paragraph.",
          },
          { role: "user", content: input },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SECRET_KEY}`,
        },
      }
    );

    // Update the conversation history with the response from ChatGPT
    setMessages([
      ...messages,
      {
        input,
        content: response.data.choices[0].message.content,
        date: Date.now(),
      },
    ]);

    // Clear the input field
    setInput("");
    setLoading(false);
  };

  return (
    <div>
      <div className="outline" style={{ color: "orange" }}>
        GM AI Assistant:
      </div>
      <div style={{ marginBottom: 10 }}>
        <input
          className="input-stat"
          type="text"
          value={input}
          style={{ width: 300, marginLeft: 0, background: "#222" }}
          onChange={handleInputChange}
          onKeyUp={(e) => {
            console.log(e);
            if (e.code === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={loading}
        />
        <button
          className="button"
          disabled={loading}
          onClick={() => {
            setMessages([]);
          }}
        >
          Clear
        </button>
      </div>
      <div
        style={{
          background: "rgba(0, 0, 0, .2)",
          padding: 5,
          marginBottom: 10,
          border: "1px solid #222",
        }}
      >
        {loading && (
          <div class="skill-detail" style={{ margin: 5, color: "orange" }}>
            Loading..
          </div>
        )}

        {!loading && messages.length < 1 && (
          <div class="skill-detail" style={{ margin: 5 }}>
            <div
              style={{
                color: "orange",
                fontSize: 10,
                marginBottom: 4,
                textTransform: "capitalize",
              }}
            >
              Introduction
            </div>
            Greetings Dungeon Master, I will help you narrate the scene by
            giving you evocative descriptions. Please send a short description
            of what you want me to describe and I'll give a proper narration
            like a dungeon master would.
          </div>
        )}
        {messages
          .sort((item1, item2) => item2.date - item1.date)
          .map((message, index) => (
            <div key={index} class="skill-detail" style={{ margin: 5 }}>
              <div
                style={{
                  color: "orange",
                  fontSize: 10,
                  marginBottom: 4,
                  textTransform: "capitalize",
                }}
              >
                {message.input}
              </div>
              {message.content}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatComponent;

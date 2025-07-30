import React, { useState } from "react";
import axios from "axios";
import OBR from "@owlbear-rodeo/sdk";
import ItemGenerator from "./ItemGenerator.json";

const ChatComponent = (props) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oneParagraph, setOneParagraph] = useState(true);
  const [prompt, setPrompt] = useState(
    "You are a fantasy writer, I'll give you a description, make it more prose and more detailed"
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSendMessage = async () => {
    // Make a request to the ChatGPT API with the user input

    setLoading(true);

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        system_instruction: {
          parts: [
            {
              text:
                prompt +
                (oneParagraph ? "Please limit it to one paragraph." : ""),
            },
          ],
        },
        contents: [
          {
            parts: [{ text: input }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_SECRET_KEY,
        },
      }
    );

    // Update the conversation history with the response from ChatGPT
    setMessages([
      ...messages,
      {
        input,
        content: response.data.candidates[0].content.parts[0].text,
        date: Date.now(),
      },
    ]);

    // Clear the input field
    setLoading(false);
  };

  const generateItems = async () => {
    // Make a request to the ChatGPT API with the user input

    setLoading(true);

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        system_instruction: {
          parts: [
            {
              text: "You are provided you with a list of item effects. Based on the sample list I will give after this message, please generate more item effects",
            },
            ItemGenerator.sample.map((item) => ({ text: item })),
          ],
        },
        contents: [
          {
            parts: [
              {
                text: "Based on the system instruction I gave you, please generate an item effect",
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_SECRET_KEY,
        },
      }
    );

    // Update the conversation history with the response from ChatGPT
    setMessages([
      ...messages,
      {
        input,
        content: response.data.candidates[0].content.parts[0].text,
        date: Date.now(),
      },
    ]);

    // Clear the input field
    setLoading(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 4,
          gap: 4,
        }}
      >
        <div className="outline" style={{ color: "orange" }}>
          GM AI Context:
        </div>
        <input
          className="input-stat"
          type="text"
          value={prompt}
          style={{ width: "100%", marginLeft: 0, background: "#222" }}
          onChange={handlePromptChange}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={loading}
        />
        <div className="outline" style={{ color: "orange" }}>
          Prompt:
        </div>
        <input
          className="input-stat"
          type="text"
          value={input}
          style={{ width: "100%", marginLeft: 0, background: "#222" }}
          onChange={handleInputChange}
          onKeyUp={(e) => {
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
            setInput("");
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 4,
        }}
      >
        <div className="outline" style={{ fontSize: 8 }}>
          Popover:
        </div>
        <button
          className="button"
          style={{ fontSize: 8, width: 35, height: 20 }}
          onClick={() => {
            if (!props.close) {
              OBR.popover.open({
                id: "chatgpt",
                url: "/chatgpt",
                height: 250,
                width: 550,
                anchorOrigin: { horizontal: "LEFT", vertical: "BOTTOM" },
                disableClickAway: true,
                marginThreshold: 10,
              });
            } else {
              OBR.popover.close("chatgpt");
            }
          }}
        >
          {!props.close ? "Open" : "Close"}
        </button>
        <div className="outline" style={{ fontSize: 8 }}>
          Generate Items:
        </div>
        <button
          className="button"
          style={{ fontSize: 8, width: 35, height: 20 }}
          disabled={loading}
          onClick={() => {
            generateItems();
          }}
        >
          Generate
        </button>
        {/* <button
          className="button"
          style={{ fontSize: 8, width: 35, height: 20 }}
          disabled={loading}
          onClick={() => {
            handleImageGenerate("Anime");
          }}
        >
          Anime
        </button>
        <button
          className="button"
          style={{ fontSize: 8, width: 35, height: 20 }}
          disabled={loading}
          onClick={() => {
            handleImageGenerate("Art");
          }}
        >
          Fantasy
        </button> */}

        <div className="outline" style={{ fontSize: 8, marginLeft: "auto" }}>
          One Paragraph Mode:
        </div>
        <button
          className="button"
          style={{
            fontSize: 8,
            width: 35,
            height: 20,
            marginRight: 4,
            textTransform: "capitalize",
            backgroundColor: oneParagraph ? "darkred" : "#222",
            color: oneParagraph ? "white" : "#ffd433",
          }}
          onClick={() => {
            setOneParagraph(!oneParagraph);
          }}
        >
          {oneParagraph ? "ON" : "OFF"}
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
          <div className="skill-detail" style={{ margin: 5, color: "orange" }}>
            Loading..
          </div>
        )}

        {!loading && messages.length < 1 && (
          <div className="skill-detail" style={{ margin: 5 }}>
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
          .map((message, index) => {
            if (message.content) {
              return (
                <div key={index} className="skill-detail" style={{ margin: 5 }}>
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
              );
            }
            if (message.image) {
              return (
                <div key={index} className="skill-detail" style={{ margin: 5 }}>
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
                  <img
                    src={message.image}
                    alt="generated"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      overflow: "hidden",
                    }}
                  />
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default ChatComponent;

import React, { useState } from "react";
import axios from "axios";
import OBR from "@owlbear-rodeo/sdk";

const ChatComponent = (props) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oneParagraph, setOneParagraph] = useState(true);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    // Make a request to the ChatGPT API with the user input

    setLoading(true);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a dungeon master for a fantasy table top role playing game, can you describe to me the next messages I'll send you like how a dungeon master would?" +
              (oneParagraph ? "Please limit it to one paragraph." : ""),
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
    setLoading(false);
  };

  // const handleImageGenerate = async (style) => {
  //   // Make a request to the ChatGPT API with the user input

  //   setLoading(true);
  //   const response = await axios.post(
  //     "https://api.openai.com/v1/images/generations",
  //     {
  //       prompt: style + " art design of a " + input,
  //       model: "dall-e-3",
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${import.meta.env.VITE_SECRET_KEY}`,
  //       },
  //     }
  //   );

  //   console.log(response);

  //   setMessages([
  //     ...messages,
  //     {
  //       input,
  //       image: response.data.data[0].url,
  //       date: Date.now(),
  //     },
  //   ]);

  //   setLoading(false);
  // };

  return (
    <div>
      <div className="outline" style={{ color: "orange" }}>
        GM AI Assistant:
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <input
          className="input-stat"
          type="text"
          value={input}
          style={{ width: 300, marginLeft: 0, background: "#222" }}
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
                width: 320,
                anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
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
        {/* <div className="outline" style={{ fontSize: 8 }}>
          Generate Image:
        </div>
        <button
          className="button"
          style={{ fontSize: 8, width: 35, height: 20 }}
          disabled={loading}
          onClick={() => {
            handleImageGenerate("Pixel");
          }}
        >
          Pixel
        </button>
        <button
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

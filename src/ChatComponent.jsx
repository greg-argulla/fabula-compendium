import React, { useState } from "react";
import axios from "axios";
import OBR from "@owlbear-rodeo/sdk";
import ItemGenerator from "./ItemGenerator.js";
import arcanist from "./data/arcanist.json";
import chimerist from "./data/chimerist.json";
import darkblade from "./data/darkblade.json";
import elementalist from "./data/elementalist.json";
import entropist from "./data/entropist.json";
import fury from "./data/fury.json";
import guardian from "./data/guardian.json";
import loremaster from "./data/loremaster.json";
import orator from "./data/orator.json";
import rogue from "./data/rogue.json";
import sharpshooter from "./data/sharpshooter.json";
import spiritist from "./data/spiritist.json";
import tinkerer from "./data/tinkerer.json";
import wayfarer from "./data/wayfarer.json";
import weaponmaster from "./data/weaponmaster.json";
import chanter from "./data/chanter.json";
import commander from "./data/commander.json";
import dancer from "./data/dancer.json";
import symbolist from "./data/symbolist.json";
import esper from "./data/esper.json";
import mutant from "./data/mutant.json";
import pilot from "./data/pilot.json";
import floralist from "./data/floralist.json";
import gourmet from "./data/gourmet.json";
import invoker from "./data/invoker.json";
import merchant from "./data/merchant.json";

const classes = [
  arcanist,
  chimerist,
  darkblade,
  elementalist,
  entropist,
  fury,
  guardian,
  loremaster,
  orator,
  rogue,
  sharpshooter,
  spiritist,
  tinkerer,
  wayfarer,
  weaponmaster,
  chanter,
  commander,
  dancer,
  symbolist,
  esper,
  mutant,
  pilot,
  floralist,
  gourmet,
  invoker,
  merchant,
];

const ChatComponent = (props) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oneParagraph, setOneParagraph] = useState(true);
  const [prompt, setPrompt] = useState(
    "You are a fantasy writer, I'll give you a description, make it concise and evocative."
  );
  const [classIndex, setClassIndex] = useState(0);
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSendMessage = async () => {
    // Make a request to the ChatGPT API with the user input

    setLoading(true);

    try {
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
    } catch (error) {
      setMessages([
        ...messages,
        {
          input,
          content: "Error generating, please try again later",
          date: Date.now(),
        },
      ]);
    }
    // Clear the input field
    setLoading(false);
  };

  const generateItems = async () => {
    // Make a request to the ChatGPT API with the user input

    setLoading(true);

    let prompt = {
      text:
        "Based on the system instruction I gave you, please generate an item effect for this character class:" +
        JSON.stringify(classes[classIndex]),
    };

    if (classIndex === 0) {
      prompt = {
        text: "Based on the system instruction I gave you, please generate an item effect",
      };
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        system_instruction: {
          parts: [
            {
              text: "You are provided with a list of item effects. Based on the sample list I will give after this message, please generate more item effects",
            },
            ItemGenerator.sample.map((item) => ({ text: item })),
          ],
        },
        contents: [
          {
            parts: [prompt],
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

    if (!response.data.error) {
      setMessages([
        ...messages,
        {
          input,
          content: response.data.candidates[0].content.parts[0].text,
          date: Date.now(),
        },
      ]);
    } else {
      setMessages([
        ...messages,
        {
          input,
          content: "Error generating, please try again later",
          date: Date.now(),
        },
      ]);
    }

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
          Quality:
        </div>
        <select
          className="input-stat outline"
          style={{ width: 80, height: 20 }}
          onChange={(e) => {
            setClassIndex(e.target.value);
          }}
        >
          <option key={0} value={0}>
            No Class
          </option>
          {classes.map((item, index) => {
            return (
              <option key={index + 1} value={index + 1}>
                {item.name}
              </option>
            );
          })}
        </select>
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

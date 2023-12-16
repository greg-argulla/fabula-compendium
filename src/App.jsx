/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import OBR from "@owlbear-rodeo/sdk";
import landingBG from "./assets/bg.jpg";
import "./App.css";

/* Data */

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
import spritist from "./data/spiritist.json";
import tinkerer from "./data/tinkerer.json";
import wayfarer from "./data/wayfarer.json";
import weaponmaster from "./data/weaponmaster.json";
import heroicskills from "./data/heroicskills.json";
import basicweapons from "./data/basicweapons.json";
import basicarmor from "./data/basicarmor.json";

import chanter from "./data/chanter.json";
import commander from "./data/commander.json";
import dancer from "./data/dancer.json";
import symbolist from "./data/symbolist.json";

const Text = (props) => {
  const { children } = props;
  return <span className="outline">{children}</span>;
};

const collection = [
  "Base Classes",
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
  spritist,
  tinkerer,
  wayfarer,
  weaponmaster,
  "High Fantasy",
  chanter,
  commander,
  dancer,
  symbolist,
  "Basic Items",
  basicweapons,
  basicarmor,
  "Heroic Skills",
  heroicskills,
];

function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const sendSkill = (skill) => {
    const skillData = {
      skillName: skill.name ? skill.name : "Blank skill",
      info: skill.info,
      detail: skill.description,
      characterName: "Compedium",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendskill": skillData,
    });
    showMessage("Skill Info Sent!");
  };

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          setName(await OBR.player.getName());
          setId(await OBR.player.getId());

          OBR.player.onChange(async (player) => {
            setName(await OBR.player.getName());
          });
        }
      });

      if (await OBR.scene.isReady()) {
        setName(await OBR.player.getName());
        setId(await OBR.player.getId());

        OBR.player.onChange(async (player) => {
          setName(await OBR.player.getName());
        });
      }
    });
  }, []);

  const parseTilde = (str) => {
    const split = str.split("~");

    return split.map((item, index) => {
      if (index % 2 !== 0) {
        return (
          <span key={"parseTilde" + index} style={{ color: "moccasin" }}>
            {item}
          </span>
        );
      }
      return <span key={"parseTilde" + index}>{item}</span>;
    });
  };

  const parseAsterisk = (str) => {
    const split = str.split("*");

    return split.map((item, index) => {
      if (index % 2 !== 0) {
        return (
          <span
            key={"parseAsterisk" + index}
            style={{ color: "red", fontSize: 11 }}
          >
            {item}
          </span>
        );
      }
      return <span key={"parseAsterisk" + index}>{parseTilde(item)}</span>;
    });
  };

  const parseDetail = (str) => {
    if (str === undefined) return "";
    const detailSplit = str.split("\n");
    return detailSplit.map((item, index) => {
      if (item === "") return <div key={"parseDetail" + index}>&#8205;</div>;

      return <div key={"parseDetail" + index}>{parseAsterisk(item)}</div>;
    });
  };

  const copyToClipboard = (info, string) => {
    navigator.clipboard.writeText(string);
    setMessage("Copied " + info + " to clipboard.");
    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const skillInstance = (item, index) => {
    const categorySearched =
      searchSkills === "" ||
      JSON.stringify(item).toLowerCase().includes(searchSkills.toLowerCase());

    if (!categorySearched) return "";
    return (
      <div
        key={"skillInstance" + index}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <div className="skill-detail">
          <div style={{ fontSize: 13, color: "darkorange" }}>
            <span
              style={{ cursor: "copy" }}
              onClick={() => {
                copyToClipboard("name", item.name);
              }}
            >
              {item.name}
            </span>
            <button
              className="button"
              style={{
                float: "right",
                font: 10,
                padding: 4,
              }}
              onClick={() => {
                sendSkill(item);
              }}
            >
              Send
            </button>
          </div>
          {item.info ? (
            <div
              style={{ color: "darkgrey", cursor: "copy" }}
              onClick={() => {
                copyToClipboard("info", item.info);
              }}
            >
              {item.info}
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
          <hr
            style={{
              marginTop: 6,
              marginBottom: 6,
              borderColor: "grey",
              backgroundColor: "grey",
              color: "grey",
            }}
          ></hr>
          <div
            style={{ cursor: "copy" }}
            onClick={() => {
              copyToClipboard("description", item.description);
            }}
          >
            {parseDetail(item.description)}
          </div>
        </div>
      </div>
    );
  };

  const tableInstance = (item, index) => {
    const categorySearched =
      searchSkills === "" ||
      JSON.stringify(item).toLowerCase().includes(searchSkills.toLowerCase());

    if (!categorySearched) return "";

    const table = item.table;
    return (
      <table
        style={{
          border: "1px solid #555",
          borderCollapse: "collapse",
          marginBottom: 10,
          backgroundColor: "#222",
        }}
      >
        <tbody>
          {table.map((row, index) => (
            <tr
              key={"tr" + index}
              style={{
                border: "1px solid #555",
                borderCollapse: "collapse",
              }}
            >
              {row.map((column) => (
                <td
                  key={column}
                  className="outline"
                  style={{
                    fontSize: 10,
                    color: index === 0 ? "darkorange" : "#fff",
                    textAlign: "left",
                    border: "1px solid #555",
                    borderCollapse: "collapse",
                    textAlign: "center",
                    padding: 4,
                  }}
                >
                  {parseDetail(column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const [searchSkills, setSearchSkills] = useState("");

  const category = (item, index) => {
    const categorySearched =
      searchSkills === "" ||
      JSON.stringify(item).toLowerCase().includes(searchSkills.toLowerCase());

    if (!categorySearched) return "";

    return (
      <div style={{ marginBottom: 20 }} key={"category" + index}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            marginBottom: 5,
            marginLeft: 2,
          }}
        >
          <span
            className="outline"
            style={{
              fontSize: 16,
              color: "red",
              marginRight: 5,
              cursor: "copy",
            }}
            onClick={() => {
              copyToClipboard("category name", item.name);
            }}
          >
            {item.name}
          </span>
          <span
            className="outline"
            style={{ fontSize: 11, cursor: "copy" }}
            onClick={() => {
              copyToClipboard("category info", item.info);
            }}
          >
            {item.info}
          </span>
        </div>
        <hr
          style={{
            marginBottom: 8,
            borderColor: "#666",
            backgroundColor: "#666",
            color: "#666",
          }}
        ></hr>
        {item.data &&
          item.data.map((itemGet, indexGet) => {
            if (itemGet.description) {
              return skillInstance(itemGet, indexGet);
            }
            if (itemGet.table) {
              return tableInstance(itemGet, indexGet);
            }
            if (itemGet.data) {
              const categorySearchedTwo =
                searchSkills === "" ||
                JSON.stringify(itemGet)
                  .toLowerCase()
                  .includes(searchSkills.toLowerCase());

              if (!categorySearchedTwo) return "";

              return (
                <div
                  key={index + "categoryChild" + indexGet}
                  style={{
                    background: "rgba(0, 0, 0, .2)",
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    marginBottom: 10,
                    border: "1px solid #222",
                  }}
                >
                  {category(itemGet, indexGet)}
                </div>
              );
            }
            return "";
          })}
      </div>
    );
  };

  const renderCategory = () => {
    return (
      <div>
        {collection.map((item, index) => {
          if (typeof item === "string") {
            return "";
          }
          if (selectedClass === "" || selectedClass === item.name) {
            return category(item, index + "");
          }
          return "";
        })}
      </div>
    );
  };

  const renderClasses = () => {
    return (
      <>
        {collection.map((item, index) => {
          if (typeof item === "string") {
            return (
              <div className="outline" style={{ textAlign: "center" }}>
                {item}
              </div>
            );
          }

          return (
            <button
              key={"renderClasses" + index}
              className="button"
              style={{
                fontWeight: "bolder",
                width: 100,
                marginBottom: 4,
                color: selectedClass === item.name ? "white" : "#ffd433",
                backgroundColor:
                  selectedClass === item.name ? "darkred" : "#222",
              }}
              onClick={() => {
                if (selectedClass !== item.name) {
                  setSelectedClass(item.name);
                } else setSelectedClass("");
              }}
            >
              {item.name}
            </button>
          );
        })}
      </>
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url(${landingBG})`,
        backgroundSize: "contain",
        height: 540,
        width: 550,
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: 30, paddingLeft: 30, paddingRight: 10 }}>
        <span
          className="outline"
          style={{ color: "orange", fontSize: 14, marginRight: 10 }}
        >
          | Fabula Ultima Compedium |
        </span>
        <Text>Search By Name: </Text>
        <input
          className="input-stat"
          style={{
            width: 150,
            color: "lightgrey",
          }}
          value={searchSkills}
          onChange={(evt) => {
            setSearchSkills(evt.target.value);
          }}
        />
        {searchSkills !== "" && (
          <button
            className="button"
            style={{ fontWeight: "bolder", width: 50 }}
            onClick={() => {
              setSearchSkills("");
            }}
          >
            Clear
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          className="scrollable-container"
          style={{
            overflow: "scroll",
            height: 450,
            marginTop: 10,
            paddingLeft: 30,
            paddingRight: 10,
            width: 100,
          }}
        >
          {renderClasses()}
        </div>
        <div
          className="scrollable-container"
          style={{
            overflow: "scroll",
            height: 450,
            marginTop: 10,
            paddingRight: 30,
            width: 400,
          }}
        >
          {renderCategory()}
        </div>
      </div>

      {message !== "" && (
        <div
          style={{
            position: "absolute",
            background: "rgba(52, 52, 52, 0.8)",
            borderRadius: 4,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
            width: 200,
            height: 28,
            padding: 8,
            textAlign: "center",
          }}
        >
          <Text>{message}</Text>
        </div>
      )}
    </div>
  );
}

export default App;

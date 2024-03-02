/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import OBR from "@owlbear-rodeo/sdk";
import landingBG from "./assets/bg.jpg";
import ChatComponent from "./ChatComponent";
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
import heroicskillshighfantasy from "./data/heroicskillshighfantasy.json";

import esper from "./data/esper.json";
import mutant from "./data/mutant.json";
import pilot from "./data/pilot.json";
import heroicskillstechnofantasy from "./data/heroicskillstechnofantasy.json";

import floralist from "./data/floralist.json";
import gourmet from "./data/gourmet.json";
import invoker from "./data/invoker.json";
import merchant from "./data/merchant.json";
import heroicskillsnaturalfantasy from "./data/heroicskillsnaturalfantasy.json";
import heroicstyles from "./data/heroicstyles.json";
import necromancer from "./data/necromancer.json";

import quirkshighfantasy from "./data/quirkshighfantasy.json";
import quirkstechnofantasy from "./data/quirkstechnofantasy.json";
import quirksnaturalfantasy from "./data/quirksnaturalfantasy.json";
import quirksbonus from "./data/quirksbonus.json";
import customweapons from "./data/customweapons.json";
import zeropower from "./data/zeropower.json";
import campactivities from "./data/campactivities.json";

// GM data
import randomQualities from "./gm/randomqualities.json";
import names from "./gm/names.json";
import location from "./gm/locations.json";

import accessoriesqualities from "./gm/accessoriesqualities";
import armorqualities from "./gm/armorqualities";
import weaponqualities from "./gm/weaponqualities";

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
  "Techno Fantasy",
  esper,
  mutant,
  pilot,
  "Natural Fantasy",
  floralist,
  gourmet,
  invoker,
  merchant,
  "Starter Items",
  basicweapons,
  basicarmor,
  customweapons,
  "Optional Rules",
  campactivities,
  zeropower,
  "Quirks",
  quirkshighfantasy,
  quirksnaturalfantasy,
  quirkstechnofantasy,
  "Heroic Skills",
  heroicskills,
  heroicskillshighfantasy,
  heroicskillstechnofantasy,
  heroicskillsnaturalfantasy,
  heroicstyles,
  "Bonus",
  necromancer,
  quirksbonus,
];

function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [role, setRole] = useState("PLAYER");

  const [isOBRReady, setIsOBRReady] = useState(false);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();
          if (metadata["ultimate.story.extension/metadata"]) {
            const playerListGet = await createPlayerList(metadata);
            setPlayerList(playerListGet);
          }
          setRole(await OBR.player.getRole());
          setIsOBRReady(true);
        } else {
          setIsOBRReady(false);
        }
      });

      if (await OBR.scene.isReady()) {
        const metadata = await OBR.scene.getMetadata();
        if (metadata["ultimate.story.extension/metadata"]) {
          const playerListGet = await createPlayerList(metadata);
          setPlayerList(playerListGet);
        }
        setRole(await OBR.player.getRole());
        setIsOBRReady(true);
      }
    });
  }, []);

  const createPlayerList = async (metadata) => {
    const metadataGet = metadata["ultimate.story.extension/metadata"];
    const playerListGet = [];
    const keys = Object.keys(metadataGet);
    keys.forEach((key) => {
      playerListGet.push(metadataGet[key]);
    });
    return playerListGet;
  };

  useEffect(() => {
    if (isOBRReady) {
      OBR.scene.onMetadataChange(async (metadata) => {
        const playerListGet = await createPlayerList(metadata);
        setPlayerList(playerListGet);
      });

      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();
          if (metadata["ultimate.story.extension/metadata"]) {
            const playerListGet = await createPlayerList(metadata);
            setPlayerList(playerListGet);
          }
          setRole(await OBR.player.getRole());
        }
      });
    }
  }, [isOBRReady]);

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

  const showMessage = (messageGet) => {
    setMessage(messageGet);

    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  const parseQuote = (str) => {
    const split = str.split("`");

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
          <span key={"parseAsterisk" + index} style={{ color: "red" }}>
            {item}
          </span>
        );
      }
      return <span key={"parseAsterisk" + index}>{parseQuote(item)}</span>;
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

  const skillInstance = (item, index, found) => {
    const categorySearched =
      searchSkills === "" ||
      found ||
      JSON.stringify(item).toLowerCase().includes(searchSkills.toLowerCase());

    if (!categorySearched) return "";
    return (
      <div
        key={"skillInstance" + index}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <div className="skill-detail">
          <div
            style={{
              fontSize: 13,
              color: "darkorange",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ cursor: "copy" }}
                onClick={() => {
                  copyToClipboard("name", item.name);
                }}
              >
                {item.name}
              </div>
              {item.info ? (
                <div
                  style={{ color: "darkgrey", cursor: "copy", fontSize: 10 }}
                  onClick={() => {
                    copyToClipboard("info", item.info);
                  }}
                >
                  {item.info}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <button
                className="button"
                style={{
                  float: "right",
                  font: 10,
                  padding: 4,
                  marginLeft: 4,
                }}
                onClick={() => {
                  sendSkill(item);
                }}
              >
                Send
              </button>
            </div>
          </div>

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

  const tableInstance = (item, index, found) => {
    const categorySearched =
      searchSkills === "" ||
      found ||
      JSON.stringify(item).toLowerCase().includes(searchSkills.toLowerCase());

    if (!categorySearched) return "";

    const table = item.table;
    return (
      <>
        <span
          className="outline"
          style={{
            fontSize: 13,
            marginRight: 5,
            cursor: "copy",
          }}
          onClick={() => {
            copyToClipboard("category name", item.name);
          }}
        >
          {item.name}
        </span>
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
                      border: "1px solid #555",
                      borderCollapse: "collapse",
                      textAlign: "center",
                      padding: 4,
                      cursor: "copy",
                    }}
                    onClick={() => {
                      let toSend = "";
                      row.forEach((element) => {
                        if (toSend === "") {
                          toSend = element;
                        } else {
                          toSend += " - " + element;
                        }
                      });
                      copyToClipboard("row", toSend);
                    }}
                  >
                    {parseDetail(column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const [searchSkills, setSearchSkills] = useState("");

  const category = (item, index, found) => {
    const categorySearched =
      searchSkills === "" ||
      found ||
      JSON.stringify(item).toLowerCase().includes(searchSkills.toLowerCase());

    const nameSearched =
      found || item.name.toLowerCase().includes(searchSkills.toLowerCase());
    if (!categorySearched) return "";

    return (
      <div style={{ marginBottom: 20 }} key={"category" + index}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
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
              return skillInstance(itemGet, indexGet, nameSearched);
            }
            if (itemGet.table) {
              return tableInstance(itemGet, indexGet, nameSearched);
            }
            if (itemGet.data) {
              const categorySearchedTwo =
                searchSkills === "" ||
                nameSearched ||
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
                  {category(itemGet, indexGet, nameSearched)}
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
        {role === "GM" && (
          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 100,
              marginBottom: 4,
              color: selectedClass === "GM" ? "white" : "orange",
              backgroundColor: selectedClass === "GM" ? "darkred" : "#222",
            }}
            onClick={() => {
              setSelectedClass("GM");
            }}
          >
            GM Helper
          </button>
        )}

        {collection.map((item, index) => {
          if (typeof item === "string") {
            return (
              <div
                className="outline"
                key={"renderClasses" + index}
                style={{ textAlign: "center" }}
              >
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

  const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  const sendChance = (chance) => {
    const numResult = Math.floor(Math.random() * 100 + 1);

    const result = {};

    if (numResult <= chance.exceptionalYes) {
      result.title = "Exceptional Yes";
      result.message = `*Yes, it definitely is!* Beyond what is expected!\nRolled a \`${numResult}\` on a ${chance.chance} out of 100 \`${chance.name}\` chance`;
    } else if (numResult <= chance.chance) {
      result.title = "Yes";
      result.message = `Yes, it is!\nRolled a \`${numResult}\` on a ${chance.chance} out of 100 \`${chance.name}\` chance`;
    } else if (numResult >= chance.exceptionalNo) {
      result.title = "Exceptional No";
      result.message = `*No, its definitely not!* Completely oppposite of what's expected!\nRolled a \`${numResult}\` on a ${chance.chance} out of a 100 \`${chance.name}\` chance`;
    } else {
      result.title = "No!";
      result.message = `No, its not!\nRolled a \`${numResult}\` on a ${chance.chance} out of 100 \`${chance.name}\` chance`;
    }

    const skillData = {
      skillName: result.title,
      info: '"The Oracle of Fate have spoken."',
      detail: result.message,
      characterName: "Fate Oracle",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendskill": skillData,
    });
    showMessage("Sent Fate Roll!");
  };

  const chances = [
    { name: "Certain", chance: 90, exceptionalYes: 18, exceptionalNo: 99 },
    { name: "Near Certain", chance: 85, exceptionalYes: 17, exceptionalNo: 98 },
    { name: "Very Likely", chance: 75, exceptionalYes: 15, exceptionalNo: 96 },
    { name: "Likely", chance: 65, exceptionalYes: 13, exceptionalNo: 94 },
    { name: "50/50", chance: 50, exceptionalYes: 10, exceptionalNo: 91 },
    { name: "Unlikely", chance: 35, exceptionalYes: 7, exceptionalNo: 88 },
    { name: "Very Unlikely", chance: 25, exceptionalYes: 5, exceptionalNo: 86 },
    {
      name: "Near Impossible",
      chance: 15,
      exceptionalYes: 3,
      exceptionalNo: 84,
    },
    { name: "Impossible", chance: 10, exceptionalYes: 2, exceptionalNo: 83 },
  ];

  const [refreshCount, setRefreshCount] = useState(0);

  const damageTypes = [
    "physical",
    "wind",
    "bolt",
    "dark",
    "earth",
    "fire",
    "ice",
    "light",
    "poison",
  ];

  const species = [
    "beast",
    "construct",
    "demon",
    "elemental",
    "humanoid",
    "monster",
    "plant",
    "undead",
  ];

  const attributes = ["dexterity", "insight", "strength", "willpower"];

  const statuses = ["dazed", "weak", "slow", "shaken", "poisoned", "enraged"];

  const attitudes = [
    "Pleasant",
    "Busy",
    "Welcoming",
    "Available",
    "Benevolent",
    "Angry",
    "Uninterested",
    "Interested",
    "Miserable",
    "Bored",
  ];

  const weather = [
    "Sunny",
    "Windy",
    "Fair",
    "Overcast",
    "Stormy",
    "Rainy",
    "Sunny",
    "Bright",
    "Overcast",
    "Fair",
  ];

  const trap = [
    "Pit",
    "Poison",
    "Slash",
    "Crush",
    "Acid",
    "Snare",
    "Cold",
    "Fire",
    "Sonic",
    "Lightning",
    "Pierce",
    "No Trap",
  ];

  const generatePrefixes = () => {
    const prefixes = [];
    randomQualities.forEach((item) => {
      if (item.Conditions && item.Conditions !== "") {
        if (item.Conditions.includes("{type}")) {
          damageTypes.forEach((type) => {
            prefixes.push(item.Conditions.replace("{type}", type));
          });
        } else if (item.Conditions.includes("{species}")) {
          species.forEach((speciesGet) => {
            prefixes.push(item.Conditions.replace("{species}", speciesGet));
          });
        } else if (item.Conditions.includes("{status}")) {
          statuses.forEach((status) => {
            prefixes.push(item.Conditions.replace("{status}", status));
          });
        } else {
          prefixes.push(item.Conditions);
        }
      }
    });
    return prefixes;
  };

  const generateSuffixes = () => {
    const prefixes = [];
    randomQualities.forEach((item) => {
      if (item.Effects && item.Effects !== "") {
        if (item.Effects.includes("{type}")) {
          damageTypes.forEach((type) => {
            prefixes.push(item.Effects.replace("{type}", type));
          });
        } else if (item.Effects.includes("{species}")) {
          species.forEach((speciesGet) => {
            prefixes.push(item.Effects.replace("{species}", speciesGet));
          });
        } else if (item.Effects.includes("{status}")) {
          statuses.forEach((status) => {
            prefixes.push(item.Effects.replace("{status}", status));
          });
        } else if (item.Effects.includes("{attribute}")) {
          attributes.forEach((attribute) => {
            prefixes.push(item.Effects.replace("{attribute}", attribute));
          });
        } else {
          prefixes.push(item.Effects);
        }
      }
    });
    return prefixes;
  };

  const prefixes = useMemo(generatePrefixes, []);
  const suffixes = useMemo(generateSuffixes, []);

  const getRandomPrefix = () => {
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  };

  const getRandomSuffix = () => {
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  };

  const table = [
    ["Roll", "Effect"],
    ["1", "Chance of Losing an Item"],
    ["2 to 4", "Lose HP (Minor to Heavy)"],
    ["5 to 7", "Lose MP (Minor to Heavy)"],
    ["8 to 10", "Lose IP/Zenit"],
    ["11 to 13", "Gain a Status Effect"],
    ["14 to 16", "GM Plot Twist"],
    ["17 to 19", "Battle Encounter"],
    ["20", "Life or Death Encounter"],
  ];

  const sendDanger = () => {
    const numResult = Math.floor(Math.random() * 20 + 1);

    let message = "";

    if (numResult === 1) {
      message = table[1][1] + ": Rolled a " + numResult;
    } else if (numResult >= 2 && numResult <= 4) {
      message = table[2][1] + ": Rolled a " + numResult;
    } else if (numResult >= 5 && numResult <= 7) {
      message = table[3][1] + ": Rolled a " + numResult;
    } else if (numResult >= 8 && numResult <= 10) {
      message = table[4][1] + ": Rolled a " + numResult;
    } else if (numResult >= 11 && numResult <= 13) {
      message = table[5][1] + ": Rolled a " + numResult;
    } else if (numResult >= 14 && numResult <= 16) {
      message = table[6][1] + ": Rolled a " + numResult;
    } else if (numResult >= 17 && numResult <= 19) {
      message = table[7][1] + ": Rolled a " + numResult;
    } else if (numResult === 20) {
      message = table[8][1] + ": Rolled a " + numResult;
    }

    const skillData = {
      skillName: "Danger!",
      info: '"Something terrible happened, what is it?"',
      detail: message,
      characterName: "Danger Table",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendskill": skillData,
    });
    showMessage("Sent Fate Roll!");
  };

  const sendRandomPlayer = (forGood) => {
    const playerListFiltered = playerList.filter((item) => !item.isGMPlayer);
    const numResult = Math.floor(Math.random() * playerListFiltered.length);

    const playerSelected = playerListFiltered[numResult];

    const skillData = {
      skillName: forGood
        ? playerSelected.traits.name + " has been selected!"
        : playerSelected.traits.name + " has been targeted!",
      info: "",
      detail: forGood
        ? '"Fate has chosen you."'
        : '"Brace yourself, this might hurt!"',
      characterName: "Random Player",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendskill": skillData,
    });
    showMessage("Sent Random Adversary!");
  };

  const sendRandomAdversary = (forGood) => {
    const playerListFiltered = playerList.filter((item) => item.isGMPlayer);
    const numResult = Math.floor(Math.random() * playerListFiltered.length);

    const playerSelected = playerListFiltered[numResult];

    const skillData = {
      skillName: forGood
        ? playerSelected.traits.name + " has been selected!"
        : playerSelected.traits.name + " has been targeted!",
      info: "",
      detail: forGood
        ? '"This creature is up to no good!"'
        : '"This creature suffers ill fate!"',
      characterName: "Random Player",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendskill": skillData,
    });
    showMessage("Sent Random Adversary!");
  };

  const [randomNumbersGenerated, setRandomNumbers] = useState([
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(location.length),
    getRandomNumber(location.length),
    getRandomNumber(location.length),
    getRandomNumber(statuses.length),
    getRandomNumber(3) + 1,
    getRandomNumber(300) + 1,
    getRandomNumber(2),
    getRandomNumber(10),
    getRandomNumber(10),
    getRandomNumber(12),
  ]);

  const generateNewRandom = () => {
    setRandomNumbers([
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(location.length),
      getRandomNumber(location.length),
      getRandomNumber(location.length),
      getRandomNumber(statuses.length),
      getRandomNumber(3) + 1,
      getRandomNumber(300) + 1,
      getRandomNumber(2),
      getRandomNumber(10),
      getRandomNumber(10),
      getRandomNumber(12),
    ]);
  };

  const [randomQualityGenerated, setRandomQuality] = useState(
    `${getRandomPrefix()}, ${getRandomSuffix()}`
  );

  const bookQualities = [
    ...accessoriesqualities,
    ...weaponqualities,
    armorqualities,
  ];

  const [bookQuality, setBookQuality] = useState(
    getRandomNumber(bookQualities.length - 1)
  );

  const generateNewQuality = () => {
    setRandomQuality(`${getRandomPrefix()}, ${getRandomSuffix()}`);
    setBookQuality(getRandomNumber(bookQualities.length - 1));
  };

  const renderGM = () => {
    return (
      <>
        <div
          className="outline"
          style={{
            fontSize: 16,
            color: "red",
            marginRight: 5,
          }}
        >
          GM Helper
        </div>
        <hr
          style={{
            marginBottom: 8,
            borderColor: "#666",
            backgroundColor: "#666",
            color: "#666",
          }}
        ></hr>
        <div
          style={{
            background: "rgba(0, 0, 0, .2)",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            marginBottom: 10,
            border: "1px solid #222",
          }}
        >
          {import.meta.env.VITE_SECRET_KEY && <ChatComponent />}
          <div className="outline" style={{ color: "orange" }}>
            Fate Question: Would it happen? (Click how likely it will happen)
          </div>
          <hr></hr>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {chances.map((item) => (
              <button
                className="button"
                style={{
                  width: 100,
                  marginBottom: 4,
                }}
                onClick={() => {
                  sendChance(item);
                }}
                title={`Chance: ${item.chance}%`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="outline" style={{ color: "#BBB" }}>
            Tip: Hover to see what are the odds
          </div>
          <hr></hr>
          <div className="outline" style={{ color: "orange" }}>
            Pick Random Target:
          </div>
          <button
            className="button"
            style={{
              width: 150,
              marginBottom: 4,
              marginRight: 4,
            }}
            onClick={() => {
              sendRandomPlayer(false);
            }}
          >
            Random Player to Target
          </button>
          <button
            className="button"
            style={{
              width: 150,
              marginBottom: 4,
            }}
            onClick={() => {
              sendRandomPlayer(true);
            }}
          >
            Random Player to Select
          </button>
          <br></br>
          <button
            className="button"
            style={{
              width: 150,
              marginBottom: 4,
              marginRight: 4,
            }}
            onClick={() => {
              sendRandomAdversary(false);
            }}
          >
            Random Adversary to Target
          </button>
          <button
            className="button"
            style={{
              width: 150,
              marginBottom: 4,
            }}
            onClick={() => {
              sendRandomAdversary(true);
            }}
          >
            Random Adversary to Select
          </button>
          <hr></hr>
          <div className="outline" style={{ color: "orange" }}>
            Names:{" "}
            <button
              className="button"
              style={{
                width: 50,
                marginBottom: 4,
                marginTop: 4,
              }}
              onClick={() => {
                generateNewRandom();
              }}
            >
              Refresh
            </button>
          </div>
          <div
            className="outline"
            style={{ color: "orange", display: "flex", gap: 10 }}
          >
            <Text>{names[randomNumbersGenerated[0]]}</Text>
            <Text>{names[randomNumbersGenerated[1]]}</Text>
            <Text>{names[randomNumbersGenerated[2]]}</Text>
            <Text>{names[randomNumbersGenerated[3]]}</Text>
            <Text>{names[randomNumbersGenerated[4]]}</Text>
            Attitude: <Text>{attitudes[randomNumbersGenerated[12]]}</Text>
          </div>
          <div className="outline" style={{ color: "orange" }}>
            Locations:
          </div>
          <div
            className="outline"
            style={{ color: "orange", display: "flex", gap: 10 }}
          >
            <Text>{location[randomNumbersGenerated[5]]}</Text>
            <Text>{location[randomNumbersGenerated[6]]}</Text>
            <Text>{location[randomNumbersGenerated[7]]}</Text>
            Weather: <Text>{weather[randomNumbersGenerated[13]]}</Text>
          </div>

          <hr></hr>
          <div className="outline" style={{ color: "orange" }}>
            Random Quality:{" "}
            <button
              className="button"
              style={{
                width: 50,
                marginBottom: 4,
                marginTop: 4,
              }}
              onClick={() => {
                generateNewQuality();
              }}
            >
              Generate
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              className="outline"
              style={{
                background: "rgba(0, 0, 0, .2)",
                padding: 5,
                border: "1px solid #222",
                color: "white",
              }}
            >
              {randomQualityGenerated}
            </div>
            <div
              className="outline"
              style={{
                background: "rgba(0, 0, 0, .2)",
                padding: 5,
                border: "1px solid #222",
                color: "white",
              }}
            >
              {`${bookQualities[bookQuality].category} - ${bookQualities[bookQuality].quality} ${bookQualities[bookQuality].cost}z`}
            </div>
          </div>

          <hr></hr>

          <div className="outline" style={{ color: "orange" }}>
            Danger Table:
          </div>
          <div style={{ display: "flex", gap: 10 }}>
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
                          border: "1px solid #555",
                          borderCollapse: "collapse",
                          textAlign: "center",
                          padding: 4,
                        }}
                      >
                        {column}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="outline" style={{ color: "orange" }}>
                Status Effect:
              </div>
              <Text>{statuses[randomNumbersGenerated[8]]}</Text>
              <div className="outline" style={{ color: "orange" }}>
                Lose IP/Zenit:
              </div>
              <Text>
                IP: {randomNumbersGenerated[9]} / Zenit:{" "}
                {randomNumbersGenerated[10]}
              </Text>
              <div className="outline" style={{ color: "orange" }}>
                Lose HP/MP:
              </div>
              <Text>{["Minor", "Heavy"][randomNumbersGenerated[11]]}</Text>
              <div className="outline" style={{ color: "orange" }}>
                Trap:
              </div>
              <Text>{trap[randomNumbersGenerated[14]]}</Text>

              <div>
                <button
                  className="button"
                  style={{
                    width: 100,
                    marginBottom: 4,
                    marginRight: 4,
                  }}
                  onClick={() => {
                    sendDanger();
                  }}
                >
                  Roll for Danger
                </button>
                <button
                  className="button"
                  style={{
                    width: 50,
                    marginBottom: 4,
                    marginTop: 4,
                  }}
                  onClick={() => {
                    generateNewRandom();
                  }}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
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
          | Fabula Ultima Compendium |
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
            if (selectedClass === "GM") {
              setSelectedClass("");
            }
            setSearchSkills(evt.target.value);
          }}
        />
        {(searchSkills !== "" || selectedClass !== "") && (
          <button
            className="button"
            style={{ fontWeight: "bolder", width: 50 }}
            onClick={() => {
              setSearchSkills("");
              setSelectedClass("");
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
          {selectedClass === "GM" ? renderGM() : renderCategory()}
        </div>
      </div>

      {message !== "" && (
        <div
          style={{
            position: "absolute",
            background: "#222",
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
          <span className="outline" style={{ fontSize: 12 }}>
            {message}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;

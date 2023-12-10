/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import OBR from "@owlbear-rodeo/sdk";
import landingBG from "./assets/bg.jpg";
import "./App.css";

const Text = (props) => {
  const { children } = props;
  return <span className="outline">{children}</span>;
};

const newPlayer = (isGMPlayer) => {
  if (isGMPlayer) {
    return {
      id: Date.now(),
      isGMPlayer: isGMPlayer,
      name: "",
      traits: {
        name: "",
      },
      attributes: {
        dex: "d8",
        ins: "d8",
        mig: "d8",
        wil: "d8",
        currentdex: "d8",
        currentins: "d8",
        currentmig: "d8",
        currentwil: "d8",
      },
      debuff: {
        slow: false,
        dazed: false,
        weak: false,
        shaken: false,
        enraged: false,
        poisoned: false,
      },
      actions: [
        {
          name: "",
          info: "",
          detail: "",
          diceOne: "dex",
          diceTwo: "dex",
          bonus: 0,
          damage: 0,
          useHR: true,
        },
      ],
    };
  }

  return {
    id: Date.now(),
    name: "",
    level: 5,
    traits: {
      name: "",
      identity: "",
      theme: "",
      origin: "",
      level: 5,
    },
    bonds: [
      { name: "", emotionOne: "", emotionTwo: "", emotionThree: "" },
      { name: "", emotionOne: "", emotionTwo: "", emotionThree: "" },
      { name: "", emotionOne: "", emotionTwo: "", emotionThree: "" },
      { name: "", emotionOne: "", emotionTwo: "", emotionThree: "" },
      { name: "", emotionOne: "", emotionTwo: "", emotionThree: "" },
      { name: "", emotionOne: "", emotionTwo: "", emotionThree: "" },
    ],
    attributes: {
      dex: "d8",
      ins: "d8",
      mig: "d8",
      wil: "d8",
      currentdex: "d8",
      currentins: "d8",
      currentmig: "d8",
      currentwil: "d8",
    },
    debuff: {
      slow: false,
      dazed: false,
      weak: false,
      shaken: false,
      enraged: false,
      poisoned: false,
    },
    stats: {
      martialDef: false,
      defenseMod: 0,
      defense: 8,
      defenseMartial: 8,
      mDefenseMod: 2,
      mDefense: 8,
      initMod: 0,
      hpMod: 0,
      mpMod: 0,
      ipMod: 0,
      fabula: 3,
      experience: 0,
      currentHP: 45,
      currentMP: 45,
      currentIP: 6,
      maxHP: 45,
      maxMP: 45,
      maxIP: 6,
    },
    items: {
      accessory: "",
      armor: "",
      mainhand: "",
      offhand: "",
      notes: "",
      zenit: 0,
      martialRitual: "",
    },
    skills: [
      {
        categoryName: "",
        categoryInfo: "",
        items: [{ name: "", info: "", detail: "" }],
      },
      {
        categoryName: "",
        categoryInfo: "",
        items: [{ name: "", info: "", detail: "" }],
      },
    ],
    actions: [
      {
        name: "",
        info: "",
        detail: "",
        diceOne: "dex",
        diceTwo: "dex",
        bonus: 0,
        damage: 0,
        useHR: true,
      },
    ],
    linkedStats: {
      currentHP: "",
      currentMP: "",
      currentIP: "",
      defense: "",
      mDefense: "",
      fabula: "",
    },
  };
};

const getDiceStat = (dice) => {
  if (dice === "d6") {
    return 6;
  }
  if (dice === "d8") {
    return 8;
  }
  if (dice === "d10") {
    return 10;
  }
  if (dice === "d12") {
    return 12;
  }
};

function App() {
  const [isOBRReady, setIsOBRReady] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [savedPlayerList, setSavePlayerList] = useState([]);
  const [player, setPlayer] = useState(null);
  const [tab, setTab] = useState("stats");
  const [role, setRole] = useState("PLAYER");
  const [exportData, setExportData] = useState(null);
  const [importData, setImportData] = useState("");
  const [copyText, setCopyText] = useState(false);
  const [metadataUpdate, setMetadata] = useState([]);
  const [cookiesNotEnabled, setCookiesNotEnabled] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [healthModifier, setHealthModifier] = useState(0);
  const [mindModifier, setMindModifier] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [diceOne, setDiceOne] = useState("");
  const [diceTwo, setDiceTwo] = useState("");
  const [message, setMessage] = useState("");
  const [ignoreFirstUpdate, setIgnoreFirstUpdate] = useState(false);

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();
          if (metadata["ultimate.story.extension/metadata"]) {
            const playerListGet = await createPlayerList(metadata);
            setPlayerList(playerListGet);
          }
          setIsOBRReady(true);
          setName(await OBR.player.getName());
          setId(await OBR.player.getId());

          OBR.player.onChange(async (player) => {
            setName(await OBR.player.getName());
          });
          setRole(await OBR.player.getRole());
        } else {
          setIsOBRReady(false);
          setPlayer(null);
        }
      });

      if (await OBR.scene.isReady()) {
        const metadata = await OBR.scene.getMetadata();
        if (metadata["ultimate.story.extension/metadata"]) {
          const playerListGet = await createPlayerList(metadata);
          setPlayerList(playerListGet);
        }
        setIsOBRReady(true);
        setName(await OBR.player.getName());
        setId(await OBR.player.getId());

        OBR.player.onChange(async (player) => {
          setName(await OBR.player.getName());
        });
        setRole(await OBR.player.getRole());
      }
    });

    try {
      localStorage.getItem("ultimate.story.extension/metadata");
    } catch {
      setCookiesNotEnabled(true);
    }
  }, []);

  const createPlayerList = async (metadata) => {
    const metadataGet = metadata["ultimate.story.extension/metadata"];
    setMetadata(metadataGet);
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
        }
      });

      try {
        const localPlayerList = JSON.parse(
          localStorage.getItem("ultimate.story.extension/metadata")
        );
        setSavePlayerList(localPlayerList);
      } catch {
        setCookiesNotEnabled(true);
      }
    }
  }, [isOBRReady]);

  const showMessage = (messageGet) => {
    setMessage(messageGet);

    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  const updateNoteItem = async (id, value, key, max) => {
    if (id === "") return;
    const valueGet = isNaN(value) ? 0 : value;
    const maxGet = isNaN(max) ? 0 : max;
    await OBR.scene.items.updateItems([id], (images) => {
      for (let image of images) {
        if (key === "defense" || key === "mDefense") {
          const format =
            valueGet > 9 ? valueGet.toString() : " " + valueGet.toString();

          const fontSize = valueGet > 9 ? 16 : 18;
          image.text.richText[0].children[0].text = format;
          image.text.style.fontSize = fontSize;
        } else if (key === "fabula") {
          const format =
            valueGet > 9 ? valueGet.toString() : " " + valueGet.toString();
          image.text.richText[0].children[0].text = format;
        } else if (maxGet) {
          image.text.richText[0].children[0].text =
            valueGet.toString() + "/" + maxGet.toString();
        } else {
          image.text.richText[0].children[0].text = valueGet.toString();
        }
      }
    });
  };

  const linkItem = (label, stat) => {
    return (
      <div>
        <span
          className="outline"
          style={{ display: "inline-block", width: 80 }}
        >
          {label}
        </span>
        <input
          className="input-stat"
          style={{
            width: 200,
            color: "white",
          }}
          value={player.linkedStats[stat]}
          readOnly={true}
        />
        <button
          className="button"
          style={{
            width: 96,
            padding: 5,
            marginRight: 4,
            marginLeft: "auto",
          }}
          onClick={async () => {
            const selected = await OBR.player.getSelection();
            if (selected && selected[0]) {
              const playerGet = { ...player };
              playerGet.linkedStats[stat] = selected[0];

              updateNoteItem(
                playerGet.linkedStats[stat],
                playerGet.stats[stat],
                stat,
                stat === "currentHP"
                  ? playerGet.stats.maxHP
                  : stat === "currentMP"
                  ? playerGet.stats.maxMP
                  : null
              );
              updatePlayer(playerGet);
            }
          }}
        >
          Link Selected Item
        </button>

        <button
          className="button"
          style={{
            width: 50,
            padding: 5,
            marginRight: 4,
            marginLeft: "auto",
          }}
          onClick={async () => {
            const playerGet = { ...player };
            playerGet.linkedStats[stat] = "";
            updatePlayer(playerGet);
          }}
        >
          Clear
        </button>
      </div>
    );
  };

  const renderLinkStats = () => {
    if (!player.linkedStats) {
      const playerGet = { ...player };
      playerGet.linkedStats = {
        currentHP: "",
        currentMP: "",
        currentIP: "",
        defense: "",
        mDefense: "",
        fabula: "",
      };
      updatePlayer(playerGet);
      return;
    }

    return (
      <>
        {linkItem("Current HP:", "currentHP")}
        {linkItem("Current MP:", "currentMP")}
        {linkItem("Current IP:", "currentIP")}
        {linkItem("Defense:", "defense")}
        {linkItem("Magic Defense:", "mDefense")}
        {linkItem("Fabula Points :", "fabula")}

        <hr></hr>
        <Text>
          Instructions: Select one item then press 'Link Selected Item' to sync
          text value of item to stats.
        </Text>
      </>
    );
  };

  const [timeoutID, setTimeoutID] = useState(null);

  const updatePlayer = (playerGet) => {
    if (!timeoutID) {
      const myTimeout = setTimeout(() => {
        savePlayer();
      }, 500);
      setTimeoutID(myTimeout);
    } else {
      clearTimeout(timeoutID);
      const myTimeout = setTimeout(() => {
        savePlayer();
      }, 500);
      setTimeoutID(myTimeout);
    }
    setIgnoreFirstUpdate(true);
    setPlayer(playerGet);
  };

  const savePlayer = async () => {
    if (player) {
      const metadataData = await OBR.scene.getMetadata();
      const metadata = metadataData["ultimate.story.extension/metadata"];
      let metadataChange = { ...metadata };
      metadataChange[player.id] = { ...player, lastEdit: id };

      OBR.scene.setMetadata({
        "ultimate.story.extension/metadata": metadataChange,
      });
      setTimeoutID(null);
    }
  };

  useEffect(() => {
    if (player && !ignoreFirstUpdate) {
      if (metadataUpdate[player.id].lastEdit !== id) {
        setPlayer(metadataUpdate[player.id]);
      }
    }
    if (ignoreFirstUpdate) {
      setIgnoreFirstUpdate(false);
    }
  }, [metadataUpdate]);

  const getDiceAttribute = (attr) => {
    if (attr === "dex") {
      return player.attributes.currentdex;
    }
    if (attr === "ins") {
      return player.attributes.currentins;
    }
    if (attr === "mig") {
      return player.attributes.currentmig;
    }
    if (attr === "wil") {
      return player.attributes.currentwil;
    }
    return attr;
  };

  const sendRoll = (roll) => {
    const rollData = {
      dex: player.attributes.currentdex,
      ins: player.attributes.currentins,
      mig: player.attributes.currentmig,
      wil: player.attributes.currentwil,
      diceOne: getDiceAttribute(roll.diceOne),
      diceTwo: getDiceAttribute(roll.diceTwo),
      diceLabelOne: roll.diceOne.toUpperCase(),
      diceLabelTwo: roll.diceTwo.toUpperCase(),
      bonus: isNaN(parseInt(roll.bonus)) ? 0 : parseInt(roll.bonus),
      damage: isNaN(parseInt(roll.damage)) ? 0 : parseInt(roll.damage),
      useHR: roll.useHR,
      skillName: roll.name,
      info: roll.info,
      detail: roll.detail,
      userId: id,
      username: name,
      characterName: player.traits.name,
      characterID: player.id,
      isGMPlayer: player.isGMPlayer,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendroll": rollData,
    });
    showMessage("Roll Sent!");
  };

  const sendSkill = (skill) => {
    const skillData = {
      skillName: skill.name ? skill.name : "Blank skill",
      info: skill.info,
      detail: skill.detail,
      characterName: player.traits.name,
      userId: id,
      username: name,
      characterID: player.id,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendskill": skillData,
    });
    showMessage("Skill Info Sent!");
  };

  const sendCharacter = (playerGet) => {
    const characterData = {
      characterName: playerGet.traits.name,
      userId: id,
      characterID: playerGet.id,
      dex: playerGet.attributes.currentdex,
      ins: playerGet.attributes.currentins,
      mig: playerGet.attributes.currentmig,
      wil: playerGet.attributes.currentwil,
      isGMPlayer: playerGet.isGMPlayer,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "ultimate.story.extension/sendcharacter": characterData,
    });
  };

  const removePlayer = async (id) => {
    const metadataData = await OBR.scene.getMetadata();
    const metadata = metadataData["ultimate.story.extension/metadata"];
    let metadataChange = { ...metadata };

    if (metadataChange[id].isGMPlayer) {
      delete metadataChange[id];

      OBR.scene.setMetadata({
        "ultimate.story.extension/metadata": metadataChange,
      });
      showMessage(`Removed character.`);
    } else {
      if (confirm("Are you sure you want to delete the character?") == true) {
        if (
          confirm(
            "You won't be able to retrieve it back, are you really sure?"
          ) == true
        ) {
          delete metadataChange[id];

          OBR.scene.setMetadata({
            "ultimate.story.extension/metadata": metadataChange,
          });
          showMessage(`Removed character.`);
        }
      }
    }
  };

  const addPlayer = async () => {
    const playerGet = newPlayer();
    const metadataData = await OBR.scene.getMetadata();
    const metadata = metadataData["ultimate.story.extension/metadata"];
    let metadataChange = { ...metadata };
    metadataChange[playerGet.id] = playerGet;

    OBR.scene.setMetadata({
      "ultimate.story.extension/metadata": metadataChange,
    });
    showMessage(`Added new character.`);
  };

  const removeItemFromArray = (array, text) => {
    const index = array.indexOf(text);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  };

  function compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    aKeys = removeItemFromArray(aKeys, "lastEdit");
    bKeys = removeItemFromArray(bKeys, "lastEdit");
    aKeys = removeItemFromArray(aKeys, "isGMPlayer");
    bKeys = removeItemFromArray(bKeys, "isGMPlayer");
    aKeys = removeItemFromArray(aKeys, "linkedStats");
    bKeys = removeItemFromArray(bKeys, "linkedStats");
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }

  const importCharacter = () => {
    const localPlayerList = JSON.parse(
      localStorage.getItem("ultimate.story.extension/metadata")
    );

    const data = JSON.parse(importData);

    if (compareKeys(data, newPlayer())) {
      if (localPlayerList) {
        localPlayerList.push(data);
        localStorage.setItem(
          "ultimate.story.extension/metadata",
          JSON.stringify(localPlayerList)
        );

        setSavePlayerList(localPlayerList);
      } else {
        localStorage.setItem(
          "ultimate.story.extension/metadata",
          JSON.stringify(data)
        );
        setSavePlayerList(data);
      }
      setPlayer(null);
      setImportData("");
      setTab("stats");
      showMessage(`Imported character.`);
    } else {
      alert(
        "Invalid Data. Please double check the export data and copy again."
      );
    }
  };

  const saveCharacterLocally = async (id) => {
    const metadataData = await OBR.scene.getMetadata();
    const metadata = metadataData["ultimate.story.extension/metadata"];
    let metadataChange = { ...metadata };

    const localPlayerList = JSON.parse(
      localStorage.getItem("ultimate.story.extension/metadata")
    );

    if (localPlayerList) {
      const foundIndex = localPlayerList.findIndex((item) => id === item.id);

      if (foundIndex !== -1) {
        localPlayerList[foundIndex] = metadataChange[id];
        localStorage.setItem(
          "ultimate.story.extension/metadata",
          JSON.stringify(localPlayerList)
        );
        setSavePlayerList(localPlayerList);
      } else if (localPlayerList) {
        localPlayerList.push(metadataChange[id]);
        localStorage.setItem(
          "ultimate.story.extension/metadata",
          JSON.stringify(localPlayerList)
        );

        setSavePlayerList(localPlayerList);
      } else {
        localStorage.setItem(
          "ultimate.story.extension/metadata",
          JSON.stringify([metadataChange[id]])
        );
        setSavePlayerList([metadataChange[id]]);
      }
    } else {
      localStorage.setItem(
        "ultimate.story.extension/metadata",
        JSON.stringify([metadataChange[id]])
      );
      setSavePlayerList([metadataChange[id]]);
    }

    showMessage(`Character Saved!`);
  };

  const loadLocalCharacter = async (data) => {
    const metadataData = await OBR.scene.getMetadata();
    const metadata = metadataData["ultimate.story.extension/metadata"];
    let metadataChange = { ...metadata };

    if (metadataChange[data.id]) {
      if (
        !confirm(
          "This character is already loaded, loading this character will replace the character in the current scene. Are you sure you want to replace the existing character?"
        ) == true
      ) {
        return;
      }
    }
    metadataChange[data.id] = data;

    OBR.scene.setMetadata({
      "ultimate.story.extension/metadata": metadataChange,
    });

    showMessage(`Loaded character!`);
  };

  const removeCharacterLocally = (index) => {
    if (
      confirm(
        "Are you sure you want to delete this locally stored character?"
      ) == true
    ) {
      const localPlayerList = JSON.parse(
        localStorage.getItem("ultimate.story.extension/metadata")
      );
      localPlayerList.splice(index, 1);
      localStorage.setItem(
        "ultimate.story.extension/metadata",
        JSON.stringify(localPlayerList)
      );
      setSavePlayerList(localPlayerList);
      showMessage(`Deleted character.`);
    }
  };

  const addGMCharacter = async () => {
    const playerGet = newPlayer(true);

    const metadataData = await OBR.scene.getMetadata();
    const metadata = metadataData["ultimate.story.extension/metadata"];
    let metadataChange = { ...metadata };
    metadataChange[playerGet.id] = playerGet;

    OBR.scene.setMetadata({
      "ultimate.story.extension/metadata": metadataChange,
    });
    showMessage(`Added GM character!`);
  };

  const debuffItem = (debuff, stat) => {
    return (
      <span
        className="outline"
        style={{
          display: "inline-block",
          padding: 4,
          color: debuff ? "red" : "white",
        }}
      >
        {stat}
      </span>
    );
  };

  const localPlayerItem = (data, index) => {
    return (
      <div key={index}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
            marginTop: 5,
          }}
        >
          <Text>Name: </Text>
          <span
            className="outline"
            style={{
              display: "inline-block",
              fontSize: 12,
              color: "orange",
              width: 150,
              textAlign: "center",
              padding: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.traits ? data.traits.name : ""}
          </span>

          <Text>Identity: </Text>

          <input
            className="input-stat"
            style={{
              width: 380,
              color: "white",
            }}
            value={data.traits.identity}
            readOnly={true}
          />
          <button
            className="button"
            style={{
              width: 96,
              padding: 5,
              marginRight: 4,
              marginLeft: "auto",
            }}
            onClick={() => {
              loadLocalCharacter(data);
            }}
          >
            Load
          </button>
          <button
            className="button"
            style={{
              width: 96,
              padding: 5,
              marginRight: 4,
              marginLeft: "auto",
            }}
            onClick={() => {
              setTab("export");
              setExportData(JSON.stringify(data));
              setCopyText(false);
            }}
          >
            Export
          </button>
          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 25,
              color: "darkred",
            }}
            onClick={() => {
              removeCharacterLocally(index);
            }}
          >
            ✖
          </button>
        </div>
        <hr />
      </div>
    );
  };

  const renderLocalPlayerList = () => {
    if (savedPlayerList) {
      if (savedPlayerList.length) {
        return savedPlayerList
          .sort((a, b) => a.traits.name.localeCompare(b.traits.name))
          .map((data, index) => {
            return localPlayerItem(data, index);
          });
      }
    }
    return "";
  };

  const playerItem = (data, index) => {
    if (data.isGMPlayer) {
      if (role !== "GM") {
        return "";
      }

      return (
        <div key={index}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
              marginTop: 5,
            }}
          >
            <Text>Name: </Text>
            <span
              className="outline"
              style={{
                display: "inline-block",
                fontSize: 12,
                color: "orange",
                width: 150,
                textAlign: "center",
                padding: 4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {data.traits ? data.traits.name : ""}
            </span>
            <Text>Debuff:</Text>
            {debuffItem(data.debuff.slow, "slow")}
            {debuffItem(data.debuff.dazed, "dazed")}
            {debuffItem(data.debuff.weak, "weak")}
            {debuffItem(data.debuff.shaken, "shaken")}
            {debuffItem(data.debuff.enraged, "enraged")}
            {debuffItem(data.debuff.poisoned, "poisoned")}
            <button
              className="button"
              style={{
                marginLeft: 4,
                width: 96,
                padding: 5,
                marginRight: 4,
              }}
              onClick={async () => {
                setTab("actions");
                setDiceOne("");
                setDiceTwo("");
                setHealthModifier(0);
                setMindModifier(0);
                setBonus(0);
                setEditMode(false);
                setPlayer(data);
                sendCharacter(data);
              }}
            >
              Open
            </button>
            {editMode && (
              <button
                className="button"
                style={{ fontWeight: "bolder", width: 25, color: "darkred" }}
                onClick={() => {
                  removePlayer(data.id);
                }}
              >
                ✖
              </button>
            )}
          </div>
          <hr />
        </div>
      );
    }

    return (
      <div key={index}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
            marginTop: 5,
          }}
        >
          <div style={{ width: 42 }}>
            <Text>Name: </Text>
          </div>
          <div
            className="outline"
            style={{
              width: 150,
              textAlign: "center",
              borderBottom: "1px solid #222",
              fontSize: 12,
              marginRight: 4,
              color: "orange",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
              paddingLeft: 4,
              minHeight: 18,
            }}
          >
            {data.traits.name}
          </div>

          <Text>FP: </Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "white",
            }}
            value={data.stats.fabula}
            readOnly={true}
          />

          <Text>HP:</Text>
          <input
            className="input-stat"
            style={{
              width: 20,
              color: "Red",
            }}
            readOnly={true}
            value={data.stats.currentHP}
          />
          <Text>MP: </Text>
          <input
            className="input-stat"
            style={{
              width: 20,
              color: "LightBlue",
            }}
            readOnly={true}
            value={data.stats.currentMP}
          />
          <Text>IP: </Text>
          <input
            className="input-stat"
            style={{
              width: 20,
              color: "Orange",
            }}
            readOnly={true}
            value={data.stats.currentIP}
          />

          <Text>DEF: </Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "violet",
            }}
            value={data.stats.defense}
            readOnly={true}
          />
          <Text>M.DEF: </Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "cyan",
            }}
            value={data.stats.mDefense}
            readOnly={true}
          />
        </div>

        <Text>Debuff:</Text>

        {debuffItem(data.debuff.slow, "slow")}
        {debuffItem(data.debuff.dazed, "dazed")}
        {debuffItem(data.debuff.weak, "weak")}
        {debuffItem(data.debuff.shaken, "shaken")}
        {debuffItem(data.debuff.enraged, "enraged")}
        {debuffItem(data.debuff.poisoned, "poisoned")}

        {editMode && (
          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 25,
              color: "darkred",
              float: "right",
            }}
            onClick={() => {
              removePlayer(data.id);
            }}
          >
            ✖
          </button>
        )}
        <button
          className="button"
          style={{
            width: 40,
            padding: 5,
            marginRight: 4,
            float: "right",
          }}
          onClick={() => {
            saveCharacterLocally(data.id);
          }}
        >
          Save
        </button>
        {role === "GM" && editMode && (
          <button
            className="button"
            style={{
              width: 40,
              padding: 5,
              marginRight: 4,
              float: "right",
            }}
            onClick={async () => {
              setTab("link");
              setPlayer(data);
            }}
          >
            Link
          </button>
        )}
        <button
          className="button"
          style={{
            marginLeft: 4,
            width: 70,
            padding: 5,
            marginRight: 4,
            float: "right",
          }}
          onClick={async () => {
            setTab("stats");
            setDiceOne("");
            setDiceTwo("");
            setHealthModifier(0);
            setMindModifier(0);
            setBonus(0);
            setEditMode(false);
            setPlayer(data);
            sendCharacter(data);
          }}
        >
          Open
        </button>
        <hr />
      </div>
    );
  };

  const renderPlayerList = () => {
    return (
      <div style={{ marginTop: 4 }}>
        <div>
          <span style={{ fontSize: 13, color: "white" }} className="outline">
            Characters:
          </span>
          {searchActions !== "" && (
            <button
              className="button"
              style={{ fontWeight: "bolder", width: 40 }}
              onClick={() => {
                setSearchActions("");
              }}
            >
              Clear
            </button>
          )}
          <button
            className="button"
            style={{ fontWeight: "bolder", width: 80, float: "right" }}
            onClick={() => {
              addPlayer();
            }}
          >
            Add Character
          </button>

          {role === "GM" && (
            <button
              className="button"
              style={{
                fontWeight: "bolder",
                width: 100,
                float: "right",
                marginRight: 4,
              }}
              onClick={() => {
                addGMCharacter();
              }}
            >
              Add GM Character
            </button>
          )}

          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 60,
              float: "right",
              marginRight: 4,
            }}
            onClick={() => {
              if (editMode) {
                showMessage(`Edit mode disabled.`);
              } else showMessage(`Edit mode enabled.`);
              setEditMode(!editMode);
            }}
          >
            {editMode ? "Done Edit" : "Edit"}
          </button>
        </div>
        <hr />
        {playerList
          .sort((a, b) => a.traits.name.localeCompare(b.traits.name))
          .sort((a, b) => {
            if (a.isGMPlayer && !b.isGMPlayer) return 1;
            if (!a.isGMPlayer && b.isGMPlayer) return -1;
            return 0;
          })
          .map((data, index) => {
            return playerItem(data, index);
          })}
      </div>
    );
  };

  const renderNav = () => {
    return (
      <div>
        {tab !== "link" ? (
          <span>
            <button
              className="button"
              style={{ marginLeft: 4, width: "auto", padding: 5 }}
              onClick={() => {
                setTab("stats");
              }}
            >
              Stats/Equipment
            </button>
            <button
              className="button"
              style={{ marginLeft: 4, width: "auto", padding: 5 }}
              onClick={() => {
                setTab("skills");
              }}
            >
              Skills/Spells
            </button>
            <button
              className="button"
              style={{
                marginLeft: 4,
                width: "auto",
                padding: 5,
                marginRight: 6,
              }}
              onClick={() => {
                setTab("actions");
              }}
            >
              Actions/Rolls
            </button>
          </span>
        ) : (
          <span
            className="outline"
            style={{
              display: "inline-block",
              marginRight: 80,
              fontSize: 13,
            }}
          >
            Link stats to owlbear items
          </span>
        )}
        <Text>HP:</Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "Red",
          }}
          onChange={(evt) => {
            const playerGet = { ...player };
            const maxHP = player.stats.maxHP;
            let value = parseInt(evt.target.value, 0);

            if (!isNaN(value)) {
              playerGet.stats.currentHP = maxHP > value ? value : maxHP;
            } else {
              playerGet.stats.currentHP = value;
            }

            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentHP,
                playerGet.stats.currentHP,
                "currentHP",
                maxHP
              );
            }

            updatePlayer(playerGet);
          }}
          value={player.stats.currentHP}
        />
        <Text>MP: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "LightBlue",
          }}
          onChange={(evt) => {
            const playerGet = { ...player };
            const maxMP =
              getDiceStat(player.attributes.wil) * 5 +
              player.stats.mpMod +
              player.traits.level;

            let value = parseInt(evt.target.value, 0);

            if (!isNaN(value)) {
              playerGet.stats.currentMP = maxMP > value ? value : maxMP;
            } else {
              playerGet.stats.currentMP = value;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentMP,
                playerGet.stats.currentMP,
                "currentMP",
                maxMP
              );
            }

            updatePlayer(playerGet);
          }}
          value={player.stats.currentMP}
        />
        <Text>IP: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "Orange",
          }}
          onChange={(evt) => {
            const playerGet = { ...player };
            const maxIP = player.stats.maxIP;

            let value = parseInt(evt.target.value, 0);
            if (!isNaN(value)) {
              playerGet.stats.currentIP = maxIP > value ? value : maxIP;
            } else {
              playerGet.stats.currentIP = value;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentIP,
                playerGet.stats.currentIP,
                "currentIP"
              );
            }

            updatePlayer(playerGet);
          }}
          value={player.stats.currentIP}
        />
        <Text>FP: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "White",
          }}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.stats.fabula = parseInt(evt.target.value);
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.fabula,
                playerGet.stats.fabula,
                "fabula"
              );
            }
            updatePlayer(playerGet);
          }}
          value={player.stats.fabula}
        />
        <button
          className="button"
          style={{
            float: "right",
            width: "auto",
            padding: 5,
            color: "red",
            marginTop: 2,
          }}
          onClick={() => {
            setPlayer(null);
          }}
        >
          Close
        </button>
      </div>
    );
  };

  const renderInfo = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ width: 44 }}>
            <Text>Name: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 160,
              color: "white",
            }}
            value={player.traits.name}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.traits.name = evt.target.value;
              updatePlayer(playerGet);
            }}
            placeholder="Your name and pronouns"
          />
          <div style={{ width: 40 }}>
            <Text>Theme: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 70,
              color: "white",
            }}
            value={player.traits.theme}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.traits.theme = evt.target.value;
              updatePlayer(playerGet);
            }}
            placeholder="A strong ideal"
          />
          <div style={{ width: 35 }}>
            <Text>Origin: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 130,
              color: "white",
            }}
            value={player.traits.origin}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.traits.origin = evt.target.value;
              updatePlayer(playerGet);
            }}
            placeholder={"Where they are from"}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            paddingTop: 4,
            alignItems: "center",
          }}
        >
          <div style={{ width: 40 }}>
            <Text>Identity: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 380,
              color: "white",
            }}
            value={player.traits.identity}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.traits.identity = evt.target.value;
              updatePlayer(playerGet);
            }}
            placeholder="This is a short sentence that sums up your character's general concept"
          />

          <Text>LVL:</Text>
          <input
            className="input-stat"
            style={{
              width: 20,
              color: "white",
            }}
            type="number"
            value={player.traits.level}
            onChange={(evt) => {
              const playerGet = { ...player };

              playerGet.stats.maxHP =
                getDiceStat(player.attributes.mig) * 5 +
                player.stats.hpMod +
                parseInt(evt.target.value);

              playerGet.stats.maxMP =
                getDiceStat(player.attributes.wil) * 5 +
                player.stats.hpMod +
                parseInt(evt.target.value);

              playerGet.traits.level = parseInt(evt.target.value);

              updateNoteItem(
                playerGet.linkedStats.currentHP,
                playerGet.stats.currentHP,
                "currentHP",
                playerGet.stats.maxHP
              );

              updateNoteItem(
                playerGet.linkedStats.currentMP,
                playerGet.stats.currentMP,
                "currentMP",
                playerGet.stats.maxMP
              );

              updatePlayer(playerGet);
            }}
          />
        </div>
      </>
    );
  };

  const bond = (index) => {
    const bond = player.bonds[index];

    const updateBond = (bond, index) => {
      const playerGet = { ...player };
      playerGet.bonds[index] = bond;
      updatePlayer(playerGet);
    };

    return (
      <div>
        <input
          className="input-stat"
          style={{
            width: 45,
            color: "white",
            marginLeft: 0,
            fontSize: 10,
          }}
          value={bond.name}
          placeholder="Bond"
          onChange={(evt) => {
            const bondGet = { ...bond };
            bondGet.name = evt.target.value;
            updateBond(bondGet, index);
          }}
        />
        <select
          className="bond-stat"
          value={bond.emotionOne}
          onChange={(evt) => {
            const bondGet = { ...bond };
            bondGet.emotionOne = evt.target.value;
            updateBond(bondGet, index);
          }}
        >
          <option value=""></option>
          <option value="Admiration">Admiration</option>
          <option value="Inferiority">Inferiority</option>
        </select>
        <select
          className="bond-stat"
          value={bond.emotionTwo}
          onChange={(evt) => {
            const bondGet = { ...bond };
            bondGet.emotionTwo = evt.target.value;
            updateBond(bondGet, index);
          }}
        >
          <option value=""></option>
          <option value="Loyalty">Loyalty</option>
          <option value="Mistrust">Mistrust</option>
        </select>
        <select
          className="bond-stat"
          value={bond.emotionThree}
          onChange={(evt) => {
            const bondGet = { ...bond };
            bondGet.emotionThree = evt.target.value;
            updateBond(bondGet, index);
          }}
        >
          <option value=""></option>
          <option value="Affection">Affection</option>
          <option value="Hatred">Hatred</option>
        </select>
      </div>
    );
  };

  const renderBonds = () => {
    return (
      <div className="bonds">
        {bond(0)}
        {bond(1)}
        {bond(2)}
        {bond(3)}
        {bond(4)}
        {bond(5)}
      </div>
    );
  };

  const getCurrentAttribute = (attr) => {
    if (attr == "dex") {
      let stat = getDiceStat(player.attributes.dex);
      if (player.debuff.slow) {
        stat = stat - 2;
      }
      if (player.debuff.enraged) {
        stat = stat - 2;
      }
      if (stat < 6) stat = 6;
      return "d" + stat;
    }
    if (attr == "ins") {
      let stat = getDiceStat(player.attributes.ins);
      if (player.debuff.dazed) {
        stat = stat - 2;
      }
      if (player.debuff.enraged) {
        stat = stat - 2;
      }
      if (stat < 6) stat = 6;
      return "d" + stat;
    }
    if (attr == "mig") {
      let stat = getDiceStat(player.attributes.mig);
      if (player.debuff.weak) {
        stat = stat - 2;
      }
      if (player.debuff.poisoned) {
        stat = stat - 2;
      }
      if (stat < 6) stat = 6;
      return "d" + stat;
    }
    if (attr == "wil") {
      let stat = getDiceStat(player.attributes.wil);
      if (player.debuff.shaken) {
        stat = stat - 2;
      }
      if (player.debuff.poisoned) {
        stat = stat - 2;
      }
      if (stat < 6) stat = 6;
      return "d" + stat;
    }
  };

  const GMAttribute = (props) => {
    const { stat, label } = props;
    return (
      <div>
        <Text>
          {label}: {player.attributes["current" + stat]}
        </Text>
        <select
          className="attribute-stat"
          value={player.attributes[stat]}
          onChange={(evt) => {
            const playerGet = { ...player };
            player.attributes[stat] = evt.target.value;
            playerGet.attributes["current" + stat] = getCurrentAttribute(stat);
            updatePlayer(playerGet);
          }}
        >
          <option value="d12">d12</option>
          <option value="d10">d10</option>
          <option value="d8">d8</option>
          <option value="d6">d6</option>
        </select>
      </div>
    );
  };

  const GMCondition = (props) => {
    const { stat, condition } = props;
    return (
      <button
        className="button"
        style={{
          marginLeft: 4,
          fontSize: 10,
          width: 40,
          textTransform: "capitalize",
          backgroundColor: player.debuff[condition] ? "darkred" : "#222",
          color: player.debuff[condition] ? "white" : "#ffd433",
        }}
        onClick={() => {
          const playerGet = { ...player };
          playerGet.debuff[condition] = !player.debuff[condition];
          playerGet.attributes["current" + stat] = getCurrentAttribute(stat);
          updatePlayer(playerGet);
        }}
      >
        {condition}
      </button>
    );
  };

  const Attribute = (props) => {
    const { stat, condition, label } = props;
    return (
      <div>
        <div>
          <Text>{label}:</Text>
        </div>
        <select
          className="attribute-stat"
          style={{ marginRight: 4 }}
          value={player.attributes[stat]}
          onChange={(evt) => {
            const playerGet = { ...player };
            player.attributes[stat] = evt.target.value;
            playerGet.attributes["current" + stat] = getCurrentAttribute(stat);

            if (stat === "mig") {
              playerGet.stats.maxHP =
                getDiceStat(evt.target.value) * 5 +
                player.stats.hpMod +
                player.traits.level;
            }

            if (stat === "wil") {
              playerGet.stats.maxMP =
                getDiceStat(evt.target.value) * 5 +
                player.stats.mpMod +
                player.traits.level;
            }

            if (!playerGet.stats.martialDef) {
              playerGet.stats.defense =
                parseInt(playerGet.stats.defenseMod) +
                getDiceStat(playerGet.attributes.currentdex);
              if (playerGet.linkedStats) {
                updateNoteItem(
                  playerGet.linkedStats.defense,
                  playerGet.stats.defense,
                  "defense"
                );
              }
            }
            playerGet.stats.mDefense =
              parseInt(playerGet.stats.mDefenseMod) +
              getDiceStat(playerGet.attributes.currentins);
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.mDefense,
                playerGet.stats.mDefense,
                "mDefense"
              );
            }
            updatePlayer(playerGet);
          }}
        >
          <option value="d12">d12</option>
          <option value="d10">d10</option>
          <option value="d8">d8</option>
          <option value="d6">d6</option>
        </select>
        <button
          className="button"
          style={{
            marginLeft: 4,
            fontSize: 10,
            width: 40,
            textTransform: "capitalize",
            backgroundColor: player.debuff[condition] ? "darkred" : "#222",
            color: player.debuff[condition] ? "white" : "#ffd433",
          }}
          onClick={() => {
            const playerGet = { ...player };
            playerGet.debuff[condition] = !player.debuff[condition];
            playerGet.attributes["current" + stat] = getCurrentAttribute(stat);
            if (!playerGet.stats.martialDef) {
              playerGet.stats.defense =
                parseInt(playerGet.stats.defenseMod) +
                getDiceStat(playerGet.attributes.currentdex);
              if (playerGet.linkedStats) {
                updateNoteItem(
                  playerGet.linkedStats.defense,
                  playerGet.stats.defense,
                  "defense"
                );
              }
            }
            playerGet.stats.mDefense =
              parseInt(playerGet.stats.mDefenseMod) +
              getDiceStat(playerGet.attributes.currentins);
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.mDefense,
                playerGet.stats.mDefense,
                "mDefense"
              );
            }
            updatePlayer(playerGet);
          }}
        >
          {condition}
        </button>
      </div>
    );
  };

  const renderAttributes = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          flexDirection: "column",
        }}
      >
        <Attribute stat="dex" label="Dexterity" condition="slow" />
        <Attribute stat="ins" label="Insight" condition="dazed" />
        <Attribute stat="mig" label="Might" condition="weak" />
        <Attribute stat="wil" label="Willpower" condition="shaken" />
      </div>
    );
  };

  const renderSecondaryCondition = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          flexDirection: "column",
        }}
      >
        <button
          className="button"
          style={{
            marginTop: 50,
            marginLeft: 0,
            marginRight: 10,
            fontSize: 10,
            width: 50,
            textTransform: "capitalize",
            backgroundColor: player.debuff.enraged ? "darkred" : "#222",
            color: player.debuff.enraged ? "white" : "#ffd433",
          }}
          onClick={() => {
            const playerGet = { ...player };
            playerGet.debuff.enraged = !player.debuff.enraged;
            playerGet.attributes["currentdex"] = getCurrentAttribute("dex");
            playerGet.attributes["currentins"] = getCurrentAttribute("ins");
            if (!playerGet.stats.martialDef) {
              playerGet.stats.defense =
                parseInt(playerGet.stats.defenseMod) +
                getDiceStat(playerGet.attributes.currentdex);
              if (playerGet.linkedStats) {
                updateNoteItem(
                  playerGet.linkedStats.defense,
                  playerGet.stats.defense,
                  "defense"
                );
              }
            }

            playerGet.stats.mDefense =
              parseInt(playerGet.stats.mDefenseMod) +
              getDiceStat(playerGet.attributes.currentins);
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.mDefense,
                playerGet.stats.mDefense,
                "mDefense"
              );
            }
            updatePlayer(playerGet);
          }}
        >
          Enraged
        </button>
        <button
          className="button"
          style={{
            marginTop: 75,
            marginLeft: 0,
            marginRight: 10,
            fontSize: 10,
            width: 50,
            textTransform: "capitalize",
            backgroundColor: player.debuff.poisoned ? "darkred" : "#222",
            color: player.debuff.poisoned ? "white" : "#ffd433",
          }}
          onClick={() => {
            const playerGet = { ...player };
            playerGet.debuff.poisoned = !player.debuff.poisoned;
            playerGet.attributes["currentmig"] = getCurrentAttribute("mig");
            playerGet.attributes["currentwil"] = getCurrentAttribute("wil");
            updatePlayer(playerGet);
          }}
        >
          Poisoned
        </button>
      </div>
    );
  };

  const renderEquipment = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          flexDirection: "column",
        }}
      >
        <div>
          <div>
            <Text>Accessory: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 332,
              color: "white",
              margin: 0,
              fontSize: 10,
            }}
            value={player.items.accessory}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.items.accessory = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
        </div>
        <div>
          <div>
            <Text>Armor: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 332,
              color: "white",
              margin: 0,
              fontSize: 10,
            }}
            value={player.items.armor}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.items.armor = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
        </div>
        <div>
          <div>
            <Text>Main Hand: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 332,
              color: "white",
              margin: 0,
              fontSize: 10,
            }}
            value={player.items.mainhand}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.items.mainhand = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
        </div>
        <div>
          <div>
            <Text>Off Hand: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 332,
              color: "white",
              margin: 0,
              fontSize: 10,
            }}
            value={player.items.offhand}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.items.offhand = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
        </div>
      </div>
    );
  };

  const renderStats = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#333",
          borderRadius: 4,
          height: 24,
        }}
      >
        <div className="outline" style={{ marginRight: 4 }}>
          <Text>Max HP:</Text>
        </div>
        <div className="outline" style={{ color: "red", marginRight: 4 }}>
          {player.stats.maxHP}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          Max MP:
        </div>
        <div className="outline" style={{ marginRight: 4, color: "lightblue" }}>
          {player.stats.maxMP}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          Max IP:
        </div>
        <div className="outline" style={{ color: "orange", marginRight: 4 }}>
          {player.stats.maxIP}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          DEF:
        </div>
        <div className="outline" style={{ color: "violet", marginRight: 4 }}>
          {player.stats.defense}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          M.DEF:
        </div>
        <div className="outline" style={{ color: "cyan", marginRight: 4 }}>
          {player.stats.mDefense}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          DEX:
        </div>
        <div className="outline" style={{ color: "lightgrey", marginRight: 4 }}>
          {player.attributes.currentdex}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          INS:
        </div>
        <div className="outline" style={{ color: "lightgrey", marginRight: 4 }}>
          {player.attributes.currentins}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          MIG:
        </div>
        <div className="outline" style={{ color: "lightgrey", marginRight: 4 }}>
          {player.attributes.currentmig}
        </div>
        <div className="outline" style={{ marginRight: 4 }}>
          WIL:
        </div>
        <div className="outline" style={{ color: "lightgrey", marginRight: 4 }}>
          {player.attributes.currentwil}
        </div>
      </div>
    );
  };

  const renderItemStats = () => {
    return (
      <div>
        <button
          className="button"
          style={{
            width: "auto",
            marginRight: 4,
            padding: 4,
          }}
          onClick={() => {
            const playerGet = { ...player };
            playerGet.stats.martialDef = !playerGet.stats.martialDef;
            if (!playerGet.stats.martialDef) {
              playerGet.stats.defense =
                parseInt(playerGet.stats.defenseMod) +
                getDiceStat(player.attributes.dex);
            } else {
              playerGet.stats.defense = playerGet.stats.defenseMartial;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.defense,
                playerGet.stats.defense,
                "defense"
              );
            }
            updatePlayer(playerGet);
          }}
        >
          {player.stats.martialDef ? "Martial" : "Non Martial"}
        </button>
        <Text>{player.stats.martialDef ? "Defense:" : "Defense Mod:"}</Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "violet",
          }}
          value={
            player.stats.martialDef
              ? player.stats.defenseMartial
              : player.stats.defenseMod
          }
          onChange={(evt) => {
            const playerGet = { ...player };
            if (player.stats.martialDef) {
              playerGet.stats.defenseMartial = parseInt(evt.target.value);
              playerGet.stats.defense = parseInt(evt.target.value);
            } else {
              playerGet.stats.defenseMod = parseInt(evt.target.value, 0);
              playerGet.stats.defense =
                parseInt(evt.target.value) +
                getDiceStat(player.attributes.currentdex);
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.defense,
                playerGet.stats.defense,
                "defense"
              );
            }
            updatePlayer(playerGet);
          }}
        />
        <Text>Magic Defense Mod: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "cyan",
          }}
          value={player.stats.mDefenseMod}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.stats.mDefenseMod = parseInt(evt.target.value);
            playerGet.stats.mDefense =
              parseInt(evt.target.value) +
              getDiceStat(player.attributes.currentins);
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.mDefense,
                playerGet.stats.mDefense,
                "mDefense"
              );
            }
            updatePlayer(playerGet);
          }}
        />
        <Text>Init. Mod: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "lightgrey",
          }}
          value={player.stats.initMod}
          onChange={(evt) => {
            const playerGet = { ...player };
            if (evt.target.value != "") {
              playerGet.stats.initMod = parseInt(evt.target.value, "");
            } else playerGet.stats.initMod = "";
            updatePlayer(playerGet);
          }}
        />
        <Text>Experience: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "lightgreen",
            marginRight: 0,
          }}
          value={player.stats.experience}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.stats.experience = parseInt(evt.target.value);
            updatePlayer(playerGet);
          }}
        />
      </div>
    );
  };

  const renderMartialUnlocked = () => {
    return (
      <div style={{ marginTop: 8 }}>
        <Text>Martial/Rituals: </Text>
        <input
          className="input-stat"
          style={{
            width: 182,
            color: "white",
          }}
          value={player.items.martialRitual}
          placeholder={"Melee/Armor/Ritualism/Elementalism/Etc."}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.items.martialRitual = evt.target.value;
            updatePlayer(playerGet);
          }}
        />
        <Text>Modifiers - </Text>
        <Text>HP: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "Red",
            marginRight: 4,
          }}
          value={player.stats.hpMod}
          onChange={(evt) => {
            const playerGet = { ...player };

            playerGet.stats.maxHP =
              getDiceStat(player.attributes.mig) * 5 +
              parseInt(evt.target.value) +
              player.traits.level;
            playerGet.stats.hpMod = parseInt(evt.target.value);
            updatePlayer(playerGet);
          }}
        />
        <Text>MP: </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "LightBlue",
            marginRight: 4,
          }}
          value={player.stats.mpMod}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.stats.maxMP =
              getDiceStat(player.attributes.wil) * 5 +
              parseInt(evt.target.value) +
              player.traits.level;
            playerGet.stats.mpMod = parseInt(evt.target.value);
            updatePlayer(playerGet);
          }}
        />
        <Text
          style={{
            width: 20,
            color: "Orange",
            marginRight: 0,
          }}
        >
          IP:
        </Text>
        <input
          className="input-stat"
          type="number"
          style={{
            width: 20,
            color: "Orange",
            marginRight: 0,
          }}
          value={player.stats.ipMod}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.stats.maxIP = 6 + parseInt(evt.target.value);
            playerGet.stats.ipMod = parseInt(evt.target.value);
            updatePlayer(playerGet);
          }}
        />
      </div>
    );
  };

  const renderNotes = () => {
    return (
      <textarea
        className="input-stat"
        rows="40"
        cols="89"
        style={{
          textAlign: "left",
          color: "#FFF",
          height: 150,
          margin: 0,
          width: 485,
          padding: 4,
        }}
        value={player.items.notes}
        onChange={(evt) => {
          const playerGet = { ...player };
          playerGet.items.notes = evt.target.value;
          updatePlayer(playerGet);
        }}
      ></textarea>
    );
  };

  const addSkill = (index) => {
    const playerGet = { ...player };
    playerGet.skills[index].items.push({ name: "", info: "", detail: "" }),
      updatePlayer(playerGet);
    showMessage(`Added new item.`);
  };

  const removeSkill = (index, itemIndex) => {
    if (confirm("Are you sure you want to delete the skill?") == true) {
      const playerGet = { ...player };
      playerGet.skills[index].items.splice(itemIndex, 1);
      updatePlayer(playerGet);
      showMessage(`Removed item.`);
    }
  };

  const skill = (data, index, itemIndex) => {
    return (
      <div key={itemIndex}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text>Name: </Text>
          <input
            className="input-stat"
            style={{
              width: 120,
              color: "lightgrey",
            }}
            value={data.name}
            placeholder="Skill/Spell/Arcana/Etc."
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.skills[index].items[itemIndex].name = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <Text>Info: </Text>
          <input
            className="input-stat"
            style={{
              width: 240,
              color: "lightgrey",
            }}
            value={data.info}
            placeholder="Level/Target/MP Cost/Duration/Damage/Other"
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.skills[index].items[itemIndex].info = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <button
            className="button"
            style={{ marginRight: 4 }}
            onClick={() => sendSkill(data)}
          >
            Show
          </button>
          <button
            className="button"
            style={{ width: 25, color: "darkred" }}
            onClick={() => {
              removeSkill(index, itemIndex);
            }}
          >
            ✖
          </button>
        </div>
        <textarea
          className="input-stat"
          rows="40"
          cols="88"
          style={{
            textAlign: "left",
            color: "#FFF",
            height: 50,
            marginLeft: 0,
            marginTop: 4,
            width: 485,
            padding: 4,
          }}
          placeholder="Add Description Here"
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.skills[index].items[itemIndex].detail = evt.target.value;
            updatePlayer(playerGet);
          }}
          value={data.detail}
        ></textarea>
      </div>
    );
  };

  const addCategory = () => {
    const playerGet = { ...player };
    playerGet.skills.push({
      categoryName: "",
      categoryInfo: "",
      items: [{ name: "", info: "", detail: "" }],
    });
    updatePlayer(playerGet);
    showMessage(`Added new category.`);
  };

  const removeCategory = (index) => {
    if (confirm("Are you sure you want to delete the category?") == true) {
      const playerGet = { ...player };
      playerGet.skills.splice(index, 1);
      showMessage(`Category removed.`);
      updatePlayer(playerGet);
    }
  };

  const category = (data, index) => {
    const categorySearched =
      searchSkills !== "" &&
      data.categoryName.toLowerCase().includes(searchSkills.toLowerCase());

    let items = [];

    if (categorySearched) {
      items = data.items;
    } else {
      items = data.items.filter((item) => {
        if (searchSkills !== "") {
          if (item.name.toLowerCase().includes(searchSkills.toLowerCase())) {
            return true;
          } else return false;
        } else {
          return true;
        }
      });
    }

    if (searchSkills !== "" && items.length < 1 && searchSkills) {
      return "";
    }

    return (
      <div style={{ marginBottom: 20 }} key={index}>
        <hr />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text>Category: </Text>
          <input
            className="input-stat"
            style={{
              width: 150,
              color: "lightgrey",
            }}
            value={data.categoryName}
            placeholder="Class/Spells/Projects/Skills/Other"
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.skills[index].categoryName = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <Text>Info: </Text>
          <input
            className="input-stat"
            style={{
              width: 130,
              color: "lightgrey",
            }}
            value={data.categoryInfo}
            placeholder="Free Benefits/Tracker/Other"
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.skills[index].categoryInfo = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <button
            className="button"
            style={{ width: 25, marginRight: 4 }}
            onClick={() => {
              sortCategoryUp(index);
            }}
          >
            ↑
          </button>
          <button
            className="button"
            style={{ width: 25, marginRight: 4 }}
            onClick={() => {
              sortCategoryDown(index);
            }}
          >
            ↓
          </button>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="button"
              style={{ fontWeight: "bolder", width: 25, marginRight: 4 }}
              onClick={() => {
                addSkill(index);
              }}
            >
              +
            </button>
          </div>
          <button
            className="button"
            style={{ fontWeight: "bolder", width: 25, color: "darkred" }}
            onClick={() => {
              removeCategory(index);
            }}
          >
            ✖
          </button>
        </div>
        <hr style={{ marginBottom: 10 }} />
        {items.map((item, itemIndex) => {
          return skill(item, index, itemIndex);
        })}
      </div>
    );
  };

  const [searchSkills, setSearchSkills] = useState("");

  const renderCategory = () => {
    return (
      <div>
        <div>
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
              style={{ fontWeight: "bolder", width: 40 }}
              onClick={() => {
                setSearchSkills("");
              }}
            >
              Clear
            </button>
          )}
          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 80,
              float: "right",
              marginTop: 2,
            }}
            onClick={() => addCategory()}
          >
            Add Category
          </button>
        </div>

        {player.skills.map((item, index) => {
          return category(item, index);
        })}
      </div>
    );
  };

  const addAction = () => {
    const playerGet = { ...player };
    playerGet.actions.push({
      name: "",
      info: "",
      detail: "",
      diceOne: "dex",
      diceTwo: "dex",
      bonus: 0,
      damage: 0,
      useHR: true,
    });
    updatePlayer(playerGet);
    showMessage(`Added new action.`);
  };

  const removeAction = (index) => {
    if (confirm("Are you sure you want to delete the action?") == true) {
      const playerGet = { ...player };
      playerGet.actions.splice(index, 1);
      updatePlayer(playerGet);
      showMessage(`Deleted action.`);
    }
  };

  const sortUp = (index) => {
    if (index !== 0) {
      const playerGet = { ...player };
      const actionOne = playerGet.actions[index];
      const actionTwo = playerGet.actions[index - 1];
      playerGet.actions[index] = actionTwo;
      playerGet.actions[index - 1] = actionOne;
      updatePlayer(playerGet);
    }
  };

  const sortDown = (index) => {
    if (index < player.actions.length - 1) {
      const playerGet = { ...player };
      const actionOne = playerGet.actions[index];
      const actionTwo = playerGet.actions[index + 1];
      playerGet.actions[index] = actionTwo;
      playerGet.actions[index + 1] = actionOne;
      updatePlayer(playerGet);
    }
  };

  const sortCategoryUp = (index) => {
    if (index !== 0) {
      const playerGet = { ...player };
      const skillOne = playerGet.skills[index];
      const skillTwo = playerGet.skills[index - 1];
      playerGet.skills[index] = skillTwo;
      playerGet.skills[index - 1] = skillOne;
      updatePlayer(playerGet);
    }
  };

  const sortCategoryDown = (index) => {
    if (index < player.skills.length - 1) {
      const playerGet = { ...player };
      const skillOne = playerGet.skills[index];
      const skillTwo = playerGet.skills[index + 1];
      playerGet.skills[index] = skillTwo;
      playerGet.skills[index + 1] = skillOne;
      updatePlayer(playerGet);
    }
  };

  const [searchActions, setSearchActions] = useState("");

  const action = (data, index) => {
    return (
      <div key={index}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text>Name: </Text>
          <input
            className="input-stat"
            style={{
              width: 120,
              color: "lightgrey",
            }}
            value={data.name}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.actions[index].name = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <Text>Info: </Text>
          <input
            className="input-stat"
            style={{
              width: 258,
              color: "lightgrey",
            }}
            value={data.info}
            placeholder="Level/Target/MP Cost/Duration/Damage/Quote/Other"
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.actions[index].info = evt.target.value;
              updatePlayer(playerGet);
            }}
          />

          <button
            className="button"
            style={{ width: 25, color: "darkred" }}
            onClick={() => {
              removeAction(index);
            }}
          >
            ✖
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
          <Text>Dice 1: </Text>
          <select
            className="attribute-stat"
            value={data.diceOne}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.actions[index].diceOne = evt.target.value;
              updatePlayer(playerGet);
            }}
          >
            <option value="dex">DEX</option>
            <option value="ins">INS</option>
            <option value="mig">MIG</option>
            <option value="wil">WIL</option>
            <option value="d12">d12</option>
            <option value="d10">d10</option>
            <option value="d8">d8</option>
            <option value="d6">d6</option>
          </select>
          <Text>Dice 2: </Text>
          <select
            className="attribute-stat"
            value={data.diceTwo}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.actions[index].diceTwo = evt.target.value;
              updatePlayer(playerGet);
            }}
          >
            <option value="dex">DEX</option>
            <option value="ins">INS</option>
            <option value="mig">MIG</option>
            <option value="wil">WIL</option>
            <option value="d12">d12</option>
            <option value="d10">d10</option>
            <option value="d8">d8</option>
            <option value="d6">d6</option>
          </select>
          <Text>Modifier:</Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "lightblue",
            }}
            value={data.bonus}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.actions[index].bonus = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <button
            className="button"
            style={{ marginRight: 4 }}
            onClick={() => {
              const playerGet = { ...player };
              playerGet.actions[index].useHR = !playerGet.actions[index].useHR;
              updatePlayer(playerGet);
            }}
          >
            {data.useHR ? "With HR" : "No HR"}
          </button>
          <Text>Damage:</Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "red",
            }}
            value={data.damage}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.actions[index].damage = evt.target.value;
              updatePlayer(playerGet);
            }}
          />
          <button
            className="button"
            style={{ marginRight: 4, width: 40 }}
            onClick={() => sendRoll(data)}
          >
            Roll
          </button>
          <button
            className="button"
            style={{ width: 25, marginRight: 4 }}
            onClick={() => {
              sortUp(index);
            }}
          >
            ↑
          </button>
          <button
            className="button"
            style={{ width: 25 }}
            onClick={() => {
              sortDown(index);
            }}
          >
            ↓
          </button>
        </div>
        <textarea
          className="input-stat"
          rows="40"
          cols="88"
          style={{
            textAlign: "left",
            color: "#FFF",
            height: 50,
            marginLeft: 0,
            marginTop: 4,
            width: 485,
            padding: 4,
          }}
          value={data.detail}
          onChange={(evt) => {
            const playerGet = { ...player };
            playerGet.actions[index].detail = evt.target.value;
            updatePlayer(playerGet);
          }}
        ></textarea>
        <hr />
      </div>
    );
  };

  const renderStatRolls = () => {
    const stats = ["dex", "ins", "mig", "wil"];

    return (
      <span>
        {stats.map((item, index) => {
          return (
            <button
              className="button"
              style={{ marginRight: 4, width: 50 }}
              onClick={() => {
                if (diceOne === "") {
                  setDiceOne(item);
                } else if (diceTwo === "") {
                  setDiceTwo(item);
                }
              }}
              key={index}
            >
              {item.toUpperCase()}
            </button>
          );
        })}
        <span style={{ display: "inline-block", marginRight: 4 }}>
          <Text>Modifier:</Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "lightblue",
            }}
            value={bonus}
            onChange={(evt) => {
              setBonus(evt.target.value);
            }}
          />
        </span>

        <span style={{ display: "inline-block", marginRight: 8 }}>
          <Text>
            {diceOne.toUpperCase()} {diceTwo ? "+" : ""} {diceTwo.toUpperCase()}
          </Text>
        </span>
        {(diceOne || diceTwo) && (
          <button
            className="button"
            style={{ marginRight: 4, width: 40 }}
            onClick={() => {
              setDiceOne("");
              setDiceTwo("");
            }}
          >
            Clear
          </button>
        )}

        {diceOne && diceTwo && (
          <button
            className="button"
            style={{ width: 80, float: "right", marginTop: 2 }}
            onClick={() => {
              sendRoll({ diceOne, diceTwo, bonus });
              setDiceOne("");
              setDiceTwo("");
            }}
          >
            Roll
          </button>
        )}

        {diceOne === "" && diceTwo === "" && !player.isGMPlayer && (
          <button
            className="button"
            style={{ width: 80, float: "right", marginTop: 2 }}
            onClick={() => {
              const value = parseInt(player.stats.initMod, 0);
              const mod = isNaN(value) ? 0 : value;
              sendRoll({
                diceOne: "dex",
                diceTwo: "ins",
                bonus: mod,
                name: "Initiative",
              });
            }}
          >
            Roll Initiative
          </button>
        )}
      </span>
    );
  };

  const renderDamageAndRestore = () => {
    return (
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <span style={{ display: "inline-block" }}>
          <Text>Change Hitpoints:</Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "red",
            }}
            value={healthModifier}
            onChange={(evt) => {
              setHealthModifier(evt.target.value);
            }}
          />
        </span>

        <button
          className="button"
          style={{ width: 65, marginRight: 4, fontSize: 10, marginTop: 2 }}
          onClick={() => {
            const playerGet = { ...player };
            const maxHP = playerGet.stats.maxHP;

            let value =
              playerGet.stats.currentHP -
              (healthModifier === "" ? 0 : parseInt(healthModifier, 0));

            if (value < 0) value = 0;

            if (!isNaN(value)) {
              playerGet.stats.currentHP = maxHP > value ? value : maxHP;
            } else {
              playerGet.stats.currentHP = value;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentHP,
                playerGet.stats.currentHP,
                "currentHP",
                maxHP
              );
            }

            updatePlayer(playerGet);

            showMessage(`Inflicted ${healthModifier} damage!`);
            setHealthModifier(0);
          }}
        >
          Damage
        </button>

        <button
          className="button"
          style={{ marginRight: 14, width: 40, fontSize: 10 }}
          onClick={() => {
            const playerGet = { ...player };
            const maxHP = playerGet.stats.maxHP;

            let value =
              playerGet.stats.currentHP +
              (healthModifier === "" ? 0 : parseInt(healthModifier, 0));

            if (!isNaN(value)) {
              playerGet.stats.currentHP = maxHP > value ? value : maxHP;
            } else {
              playerGet.stats.currentHP = value;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentHP,
                playerGet.stats.currentHP,
                "currentHP",
                maxHP
              );
            }

            updatePlayer(playerGet);
            showMessage(`Healed ${healthModifier} hitpoints!`);
            setHealthModifier(0);
          }}
        >
          Heal
        </button>

        <span style={{ display: "inline-block" }}>
          <Text>Change Mindpoints:</Text>
          <input
            className="input-stat"
            type="number"
            style={{
              width: 20,
              color: "lightblue",
            }}
            value={mindModifier}
            onChange={(evt) => {
              setMindModifier(evt.target.value);
            }}
          />
        </span>

        <button
          className="button"
          style={{ width: 65, marginRight: 4, fontSize: 10, marginTop: 2 }}
          onClick={() => {
            const playerGet = { ...player };
            const maxMP = playerGet.stats.maxMP;

            let value =
              playerGet.stats.currentMP -
              (mindModifier === "" ? 0 : parseInt(mindModifier, 0));

            if (value < 0) value = 0;

            if (!isNaN(value)) {
              playerGet.stats.currentMP = maxMP > value ? value : maxMP;
            } else {
              playerGet.stats.currentMP = value;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentMP,
                playerGet.stats.currentMP,
                "currentMP",
                maxMP
              );
            }

            updatePlayer(playerGet);
            showMessage(`Spent ${mindModifier} mindpoints!`);
            setMindModifier(0);
          }}
        >
          Spend
        </button>

        <button
          className="button"
          style={{ marginRight: 4, width: 40, fontSize: 10 }}
          onClick={() => {
            const playerGet = { ...player };
            const maxMP = playerGet.stats.maxMP;

            let value =
              playerGet.stats.currentMP +
              (mindModifier === "" ? 0 : parseInt(mindModifier, 0));

            if (!isNaN(value)) {
              playerGet.stats.currentMP = maxMP > value ? value : maxMP;
            } else {
              playerGet.stats.currentMP = value;
            }
            if (playerGet.linkedStats) {
              updateNoteItem(
                playerGet.linkedStats.currentMP,
                playerGet.stats.currentMP,
                "currentMP",
                maxMP
              );
            }

            updatePlayer(playerGet);
            showMessage(`Restored ${mindModifier} mindpoints!`);
            setMindModifier(0);
          }}
        >
          Restore
        </button>
      </div>
    );
  };

  const renderActionList = () => {
    const items = player.actions.filter((item) => {
      if (searchActions !== "") {
        if (item.name.toLowerCase().includes(searchActions.toLowerCase())) {
          return true;
        } else return false;
      } else {
        return true;
      }
    });
    return (
      <div>
        <div>
          {renderStatRolls()}
          <hr />
          <Text>Search By Name: </Text>
          <input
            className="input-stat"
            style={{
              width: 150,
              color: "lightgrey",
            }}
            value={searchActions}
            onChange={(evt) => {
              setSearchActions(evt.target.value);
            }}
          />
          {searchActions !== "" && (
            <button
              className="button"
              style={{ fontWeight: "bolder", width: 40 }}
              onClick={() => {
                setSearchActions("");
              }}
            >
              Clear
            </button>
          )}
          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 80,
              float: "right",
              marginTop: 2,
            }}
            onClick={() => {
              addAction();
            }}
          >
            Add Action
          </button>
        </div>
        <hr />

        {items.map((item, index) => {
          return action(item, index);
        })}
      </div>
    );
  };

  const renderGMNav = () => {
    return (
      <div>
        <div style={{ display: "flex", marginTop: 4 }}>
          <div style={{ width: 44 }}>
            <Text>Name: </Text>
          </div>
          <input
            className="input-stat"
            style={{
              width: 160,
              color: "white",
            }}
            value={player.traits.name}
            onChange={(evt) => {
              const playerGet = { ...player };
              playerGet.traits.name = evt.target.value;
              updatePlayer(playerGet);
            }}
            placeholder="Your Enemy Name"
          />
          <GMCondition stat="dex" condition="slow" />
          <GMCondition stat="ins" condition="dazed" />
          <GMCondition stat="mig" condition="weak" />
          <GMCondition stat="wil" condition="shaken" />
          <button
            className="button"
            style={{
              marginLeft: 4,
              fontSize: 10,
              width: 50,
              textTransform: "capitalize",
              backgroundColor: player.debuff.enraged ? "darkred" : "#222",
              color: player.debuff.enraged ? "white" : "#ffd433",
            }}
            onClick={() => {
              const playerGet = { ...player };
              playerGet.debuff.enraged = !player.debuff.enraged;
              playerGet.attributes["currentdex"] = getCurrentAttribute("dex");
              playerGet.attributes["currentins"] = getCurrentAttribute("ins");
              updatePlayer(playerGet);
            }}
          >
            Enraged
          </button>
          <button
            className="button"
            style={{
              marginLeft: 4,
              marginRight: 10,
              fontSize: 10,
              width: 50,
              textTransform: "capitalize",
              backgroundColor: player.debuff.poisoned ? "darkred" : "#222",
              color: player.debuff.poisoned ? "white" : "#ffd433",
            }}
            onClick={() => {
              const playerGet = { ...player };
              playerGet.debuff.poisoned = !player.debuff.poisoned;
              playerGet.attributes["currentmig"] = getCurrentAttribute("mig");
              playerGet.attributes["currentwil"] = getCurrentAttribute("wil");
              updatePlayer(playerGet);
            }}
          >
            Poisoned
          </button>
          <button
            className="button"
            style={{
              width: "auto",
              padding: 5,
              marginLeft: "auto",
              color: "red",
            }}
            onClick={() => {
              setPlayer(null);
            }}
          >
            Close
          </button>
        </div>
        <hr />
        <div style={{ display: "flex", gap: 10 }}>
          <GMAttribute stat="dex" label="Dexterity" />
          <GMAttribute stat="ins" label="Insight" />
          <GMAttribute stat="mig" label="Might" />
          <GMAttribute stat="wil" label="Willpower" />
        </div>
        <div></div>
      </div>
    );
  };

  const renderExportData = () => {
    return (
      <div>
        <div>
          <span style={{ fontSize: 13, color: "White" }} className="outline">
            Export:
          </span>

          <button
            className="button"
            style={{
              marginLeft: 4,
              width: "auto",
              padding: 5,
              float: "right",
              color: "red",
            }}
            onClick={() => {
              setPlayer(null);
              setTab("stats");
            }}
          >
            Close
          </button>
        </div>
        <hr />
        <Text>
          Copy the text below to export your character. Use import to bring your
          characters to other rooms:
        </Text>
        <textarea
          className="input-stat"
          rows="40"
          cols="89"
          style={{
            textAlign: "left",
            color: "#FFF",
            height: 150,
            margin: 0,
            width: 485,
            padding: 4,
          }}
          value={exportData}
          readOnly={true}
        ></textarea>
        <button
          className="button"
          style={{
            marginLeft: 4,
            padding: 5,
            float: "right",
            width: 150,
          }}
          onClick={() => {
            navigator.clipboard.writeText(exportData);
            setCopyText(true);
            setTimeout(() => {
              setCopyText(false);
            }, 1500);
          }}
        >
          {copyText ? "Copied to Clipboard" : "Copy Text"}
        </button>
      </div>
    );
  };

  const renderImportData = () => {
    return (
      <div>
        <div>
          <span style={{ fontSize: 13, color: "White" }} className="outline">
            Import:
          </span>
          <button
            className="button"
            style={{
              marginLeft: 4,
              width: "auto",
              padding: 5,
              float: "right",
              color: "red",
            }}
            onClick={() => {
              setPlayer(null);
              setTab("stats");
            }}
          >
            Close
          </button>
        </div>
        <hr />
        <Text>
          Paste the exported text below to import your character. Use export to
          bring your characters to other rooms:
        </Text>
        <textarea
          className="input-stat"
          rows="40"
          cols="89"
          style={{
            textAlign: "left",
            color: "#FFF",
            height: 150,
            margin: 0,
            width: 485,
            padding: 4,
          }}
          value={importData}
          onChange={(evt) => {
            setImportData(evt.target.value);
          }}
        ></textarea>
        <button
          className="button"
          style={{
            marginLeft: 4,
            padding: 5,
            float: "right",
            color: "white",
            width: 150,
          }}
          onClick={() => {
            importCharacter();
          }}
        >
          Import
        </button>
      </div>
    );
  };

  if (cookiesNotEnabled) {
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
        <div
          className="scrollable-container"
          style={{
            overflow: "scroll",
            height: 500,
            marginTop: 40,
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <div className="outline" style={{ color: "red", font: 14 }}>
            Error:
          </div>
          <div className="outline" style={{ fontSize: 14 }}>
            You need to enable 3rd Party cookies for this extention to work.
            This is because some character data is stored in the browser
            localstorage that enables characters to transfer between scenes.
          </div>
        </div>
      </div>
    );
  }

  if (!isOBRReady) {
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
        <div
          className="scrollable-container"
          style={{
            overflow: "scroll",
            height: 500,
            marginTop: 40,
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <div className="outline" style={{ color: "red", font: 14 }}>
            No Scene found.
          </div>
          <div className="outline" style={{ fontSize: 14 }}>
            You need to load a scene to start adding/updating characters. If a
            scene is already loaded, kindly refresh the page.
          </div>
        </div>
      </div>
    );
  }

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
      <div
        className="scrollable-container"
        style={{
          overflow: "scroll",
          height: 500,
          marginTop: 20,
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        {player ? (
          <>
            {!player.isGMPlayer ? renderNav() : renderGMNav()}
            <hr />
            {tab === "stats" && (
              <div>
                {renderInfo()}
                <hr />
                {renderBonds()}
                <hr />
                {renderStats()}
                {renderDamageAndRestore()}
                <hr />

                {renderItemStats()}
                <div style={{ display: "flex" }}>
                  <div>{renderAttributes()}</div>
                  <div>{renderSecondaryCondition()}</div>
                  <div>{renderEquipment()}</div>
                </div>
                {renderMartialUnlocked()}
                <hr />
                <div style={{ marginBottom: 8 }}>
                  <Text>Character Notes/Backpack</Text>
                  <span style={{ float: "right" }}>
                    <Text>Zenit: </Text>
                    <input
                      className="input-stat"
                      type="number"
                      style={{
                        width: 60,
                        color: "gold",
                        marginRight: 0,
                      }}
                      value={player.items.zenit}
                      onChange={(evt) => {
                        const playerGet = { ...player };
                        playerGet.items.zenit = parseInt(evt.target.value);
                        updatePlayer(playerGet);
                      }}
                    />
                  </span>
                </div>
                {renderNotes()}
              </div>
            )}
            {tab === "skills" && renderCategory()}
            {tab === "actions" && renderActionList()}
            {tab === "link" && renderLinkStats()}
          </>
        ) : (
          <>
            {tab === "export" ? (
              renderExportData()
            ) : tab === "import" ? (
              renderImportData()
            ) : (
              <div>
                {renderPlayerList()}
                <div style={{ marginTop: 40 }}>
                  <span
                    style={{ fontSize: 13, color: "White" }}
                    className="outline"
                  >
                    Room Saved Character:
                  </span>
                  <button
                    className="button"
                    style={{
                      fontWeight: "bolder",
                      width: 100,
                      float: "right",
                      marginRight: 4,
                    }}
                    onClick={() => {
                      setTab("import");
                      setExportData("");
                      setCopyText(false);
                    }}
                  >
                    Import Character
                  </button>
                </div>
                <hr />
                {renderLocalPlayerList()}
              </div>
            )}
          </>
        )}
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

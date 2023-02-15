import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./fire";

const db = firebase.firestore();

export default function Home() {
  const mydata = [];
  const [data, setData] = useState(mydata);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [flag, setFlag] = useState(false);

  const onChangeName = (e) => {
    setName(e.target.value); //nameにテキストボックスの文を代入
  };
  const onChangeText = (e) => {
    setText(e.target.value); //textにテキストボックスの文を代入
  };

  const addText = (e) => {
    const ob = {
      name: name,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("mydata")
      .add(ob)
      .then(() => {
        //mydataにobを追加
        setName(""); //テキストボックスをクリア
        setText("");
        setFlag(!flag);
      });
    setMessage("投稿しました");
  };

  useEffect(() => {
    //初回と投稿ボタンが押されたときに実行（表示の更新）
    db.collection("mydata")
      .orderBy("timestamp", "asc")
      .get()
      .then((snapshot) => {
        //mydataコレクションを取得.投稿時間で昇順にソート.
        snapshot.forEach((document) => {
          const doc = document.data(); //docにフィールドの情報がまとめられたオブジェクトを代入
          mydata.push(
            <div>
              <div>
                名前:{doc.name}
                {new Date(doc.timestamp?.toDate()).toLocaleString()}
              </div>
              <div>{doc.text}</div>
            </div>
          );
        });
        setData(mydata); //mydataをdataに代入
        setMessage("質問などあればお書きください");
      });
  }, [flag]);

  return (
    <div>
      <h3>{message}</h3>

      <table>
        <thead>
          <tr>{data}</tr>
        </thead>
      </table>
      <p>
        お名前
        <input
          type="text"
          value={name}
          maxLength="12"
          onChange={onChangeName}
        />
      </p>
      <p>
        このスレッドに書き込む
        <input type="text" value={text} onChange={onChangeText} />
      </p>
      <button onClick={addText}>投稿する</button>
    </div>
  );
}
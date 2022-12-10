import {useState, useEffect} from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import '../components/fire'

const db = firebase.firestore()

export default function Home() {
    const mydata = []
    const [data, setData] = useState(mydata)
    const [message, setMessage] = useState('コメントを入力')
    const [text, setText] = useState('')
    const [flag, setFlag] = useState(false)

    const onChangeText = ((e)=> {
        setText(e.target.value) //textにテキストボックスの文を代入
    })

    const addText = ((e)=> {
        const ob = {
            text:text,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        }
        
        db.collection('mydata').add(ob).then(()=>{ //mydataにobを追加
            setText('') //テキストボックスをクリア
            setFlag(!flag)
        })
        setMessage('投稿しました')

            })

    useEffect(() => {
        db.collection('mydata').orderBy('timestamp', 'asc').get().then((snapshot) => { //mydataコレクションを取得.投稿時間で昇順にソート.
            snapshot.forEach((document) => {
                const doc = document.data() //docにフィールドの情報がまとめられたオブジェクトを代入
                mydata.push(
                    <tr key={document.id}>
                        <td><a href={'/fire/del?id=' + document.id}>
                            {document.id}</a></td>
                            <td>{doc.text}</td>
                        
                    </tr>
                )
            })
            setData(mydata) //mydataをdataに代入
            setMessage('Firebase data')
        })
    }, [flag])

    return (
        <div>
            <h5>{message}</h5>
            <div>
                <input type="text" value={text} onChange={onChangeText} />
            </div>
            <button onClick={addText}>Add</button>
            <table>
              <thead>
                <tr>
                    <th>ID</th>
                    <th>Text</th>
                </tr>
              </thead>
              <tbody>
                {data}
              </tbody>
            </table>
        </div>
    )
}


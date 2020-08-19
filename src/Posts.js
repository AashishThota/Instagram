import React, { useState, useEffect } from 'react'
import './Posts.css'
import './images/dp.jpg'
import {Avatar, Button} from '@material-ui/core'
import { db } from './firebase';
import firebase from 'firebase';
function Posts({postId,user,username,imageUrl,caption}) {
    const [comments,setComments] = useState([]);
    const [coment,setComent]=useState("");
    useEffect(() => {
        let unsubscribed;
        if(postId){
            unsubscribed=db.collection("posts").doc(postId).collection("comments").orderBy("timestamp","desc").onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map(doc=>doc.data()));
            });
        }
        return ()=>{
            unsubscribed();
        }
    }, [postId])
    
    const postComment=(event)=>{
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: coment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComent('');
    }

    return (
        <div className="post">
            {/*header --> avatar + username*/}
            <div className="post__header">
            <Avatar className="post__avatar" src="" alt={username} >{username[0]}</Avatar>
            <h1>{username}</h1>
            </div>
            
            {/*image*/}
            <img className="post__image" src={imageUrl} />
            {/*username + caption */}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            <div className="post__comments">
            {comments.map((comment)=>(
                <p className="post__comment">
                <strong>{comment.username}</strong> {comment.text}
                </p>
                
                ))}
            </div>
        {user && (     <form className="post__commentBox">
        
        <input 
        className="post__text"
        type="text"
        placeholder="Add a comment..."
        
        onChange={(e)=>setComent(e.target.value)} 
        value={coment}/>
        
        <button
        className="post__button"
        disabled={!coment}
        type="submit"
        onClick={postComment}

        >Post</button>
        </form>)}
   
        </div>
    )
}

export default Posts

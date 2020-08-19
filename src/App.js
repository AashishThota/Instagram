import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./App.css";
import { db,auth } from "./firebase";
import Posts from "./Posts";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import firebase from 'firebase';
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection("posts").orderBy("timestamp","desc").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);

  useEffect(() => {
    const unsubsribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser)
        setUser(authUser)
      
      }
      else{
        setUser(null);
      }
    });
    return () => {
      unsubsribe();
    }
  }, [user, username])

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username,
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
  };

  const signIn=(event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    
    setOpenSignIn(false);

  }

  return (
    <div className="App">

    {/*Caption input */}
    {/*File Picker */}
    
    
    {/*Post button */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
 
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>

      {/*Header*/}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (<Button onClick={() => auth.signOut()}>Logout</Button>) : 
      (
        <div className="app_loginContainer">
        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
        )}
      
      </div>
      <div className="app__posts"> 
      <div className="app_postsLeft"> 
      {posts.map(({ id, post }) => (
        <Posts
          key={id}
          postId={id}
          user={user}
          username={post.username}
          imageUrl={post.imageUrl}
          caption={post.caption}
        />
      ))}
      </div>

      <div className="app__postsRight">
      <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
      </div>
      

      </div>
      

      {/*posts*/}

      { user?.displayName ? (<ImageUpload username={user.displayName}/>) : (<h3>Sorry! Please login to Upload</h3>) }
      
    </div>
  );
}

export default App;

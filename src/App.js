import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

// if(!firebase.app.length){
  
// }
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }
    
    const handleFbSignIn = () => {
     
      firebase.auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log('fb user after sign in', user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
    }


  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: '', 
        photo: '',
        email: '',
        error: '',
        success: false
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  const handleSubmit = (event) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
  })
  .catch((error) => {
    const newUserInfo = {...user}
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
}

  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log('sign in user info', res.user);
  })
  .catch((error) => {
    const newUserInfo = {...user}
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
  }
  event.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
      })
      .then(function() {
        console.log('username updated successfully')
      }).catch(function(error) {
        console.log(error);
      });
  }

  const handleBlur = (event) => {
    let isFormValid;
    if(event.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(event.target.value);  
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
      const newUserInfo ={...user};
      newUserInfo[event.target.value] = event.target.value;
      setUser(newUserInfo);
    }
  }


  const clicked = () => {
    console.log('clicked');
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      <br/>
      <button onClick={handleFbSignIn}>Log in using Facebook</button>
      {
        user.isSignedIn && <div>
          <img src={user.photo} alt={user.name}/>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
        </div>
      }

      <h1>Our own authentication system</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form action="" onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur}  placeholder="Your name"/>}
      <input type="text" onBlur={handleBlur} name="email"  placeholder="Enter your email address"/>
      <br/>
      <input type="password" name="password" onChange={handleBlur} placeholder="Your password"/>
      <br/>
      <input onClick={clicked} type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User {newUser ?'Created' : 'Logged in'} Successfully</p>}
    </div>
  );
}

export default App;

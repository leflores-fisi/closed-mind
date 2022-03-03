import { useRef, useState, useEffect } from "react";
import useAppReducer from "../../hooks/useAppReducer"
import { connectSocket, setGlobalColor, setGlobalUsername } from "../../context/actions";
import { userSocket } from "../userSocket";
import './UserForm.scss'
import ColorPicker from "./ColorPicker";

function UserInformation() {

  const {store, dispatch} = useAppReducer();
  const [username, setUsername] = useState(store.username);
  const [userCode, setUserCode] = useState(store.user_code || `#${randomIdCode(4)}`);
  const [userColor, setUserColor] = useState(store.user_color || 'gray');
  const [isValidUsername, setIsValidUsername] = useState(true);
  const inputRef = useRef(null);

  const handleUsernameInput = (e) => {
    let usernameInput = e.target.value;
    setUsername(usernameInput);
    generateUserId(usernameInput);
    setIsValidUsername(validateUsername(usernameInput));
  }
  const generateUserId = (username) => {
    let generatedCode = `#${randomIdCode(4)}`;
    setUserCode(generatedCode);
    dispatch(setGlobalUsername({
      username: username.trim().replaceAll(' ', '-'),
      userCode: generatedCode
    }));
  }
  const connectIntoServer = (e) => {
    if (e) e.preventDefault()
    if (isValidUsername) {
      userSocket.removeAllListeners()
      userSocket.connect();
      dispatch(connectSocket({}))
    }
  }
  useEffect(() => {
    inputRef.current.focus();
  }, [])
  

  return (
    <div className='user-form'>
      <form className='user-form__username' onSubmit={connectIntoServer} id='connect-socket-form'>
        <div className='title'>Username:</div>
          <div className={'username-form' + (isValidUsername ? '' : ' invalid')}>
            <input
              className={`username-input ${userColor}`}
              ref={inputRef}
              value={username}
              onChange={handleUsernameInput}>
            </input>
            <div className='unique-id'>
              {userCode}
            </div>
            <button
              title='Regenerate id'
              type='button'
              onClick={() => generateUserId(inputRef.current.value)}
            >♻</button>
          </div>
          <ColorPicker onPick={(color) => {
            setUserColor(color);
            dispatch(setGlobalColor({color}))
          }}/>
      </form>

      <div className='user-form__connect'>
        <button
          className='connect-user-btn'
          type='submit'
          form='connect-socket-form'
        >Connect</button>
      </div>
    </div>
  )
}

function randomIdCode(len) {
  let chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'w', 'x', 'y', 'z']
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let id = ''
  
  for (let i = 0; i < len; i++) {
    id += Math.random() < 0.7
    	? numbers[(~~(numbers.length * Math.random()))]
    	: chars[(~~(chars.length * Math.random()))]
  }
  return id
}
function validateUsername(username) {
  return (
    username.length <= 16   &&
    !username.includes('#') &&
    username.length >= 3
  )
}

export default UserInformation;
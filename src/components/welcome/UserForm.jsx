import { useRef, useState, useEffect } from 'react';
import useAppReducer from "../../hooks/useAppReducer"
import { connectSocket, setGlobalColor, setGlobalUsername } from "../../context/actions";
import { userSocket } from "../userSocket";
import './UserForm.scss'
import ColorPicker from "./ColorPicker";

function UserForm({ onSubmit = () => {}}) {

  const {store, dispatch} = useAppReducer();

  const [username, setUsername]   = useState(store.username);
  const [userCode, setUserCode]   = useState(store.user_code || `#${randomIdCode(4)}`);
  const [userColor, setUserColor] = useState(store.user_color || 'gray');

  const [validatingUsername, setValidatingUsername] = useState(false);
  const [invalidReason, setInvalidReason]           = useState('');
  const [isValidUsername, setIsValidUsername]       = useState(true);
  const inputRef = useRef(null);

  const handleUsernameInput = (e) => {
    let usernameInput = e.target.value;
    setInvalidReason('');
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
  const connectIntoServer = async (e) => {
    e.preventDefault();
    setValidatingUsername(true);

    try {
      const response = await fetch('http://localhost:8001/username_validation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: username
        })
      });
      
      if (response.status === 200) {
        userSocket.connect();
        setIsValidUsername(true);
        setInvalidReason('');
        setValidatingUsername(false);
        userSocket.removeAllListeners();
        console.log('Removing socket listeners from UserForm')
        dispatch(connectSocket());
      }
      else if (response.status === 422) {
        const {reason} = await response.json();
        setIsValidUsername(false);
        setInvalidReason(reason);
        setValidatingUsername(false);
      }
    }
    catch (error) {
      setIsValidUsername(false);
      setInvalidReason("Error: Couldn't connect to server");
      setValidatingUsername(false);
    }
  }
  useEffect(() => {
    inputRef.current.focus();
  }, [])
  

  return (
    <div className='user-form'>
      <form className='user-form__username' id='connect-socket-form' 
        onSubmit={(e) => {
          connectIntoServer(e);
          onSubmit();
        }
      }>
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
        <div className='user-form__connect'>
          <button
            className='connect-user-btn'
            type='submit'
            form='connect-socket-form'
          >Connect</button>
        </div>
        <div className='form-feedback'>
          {
            validatingUsername ? <div className='feedback gray'>Connecting...</div>
            : !isValidUsername ? <div className='feedback brightRed'>{invalidReason}</div>
            : null
          }
        </div>
      </form>
    </div>
  )
}

function randomIdCode(len) {
  let chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'w', 'x', 'y', 'z'];
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let id = '';
  
  for (let i = 0; i < len; i++) {
    id += Math.random() < 0.7
    	? numbers[(~~(numbers.length * Math.random()))]
    	: chars[(~~(chars.length * Math.random()))];
  }
  return id;
}
function validateUsername(username) {
  return (
    username.length <= 16   &&
    !username.includes('#') &&
    username.length >= 3
  );
}

export default UserForm;
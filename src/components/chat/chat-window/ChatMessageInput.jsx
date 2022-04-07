import { useState, forwardRef, useRef, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import TextareaAutosize from 'react-textarea-autosize';
import { emitSocketEvent } from '@/services/userSocket';
import useAppReducer from '@/hooks/useAppReducer';
import useChatInput from '@/hooks/useChatInput';
import { saveLineToHistory, appendMessage, appendErrorMessage, clearChat } from '@/context/actions';
import AvailableCommandsTable from './statics/AvailableCommandsTable';
import { waitForSeconds } from '@/Helpers';
import { IoSend } from 'react-icons/io5';
import HoverableTitle from '@/components/overlay/HoverableTitle';
import { MEDIA_API_URL } from '@/services/userSocket';
import MultimediaPreview from './MultimediaPreview';
import FilesDropArea from './chat-interactive/FilesDropArea';
import './ChatInput.scss';
import InvalidFilesOverlay from './InvalidFilesOverlay';

const waiterEnded = waitForSeconds(2);

// forward ref
function ChatMessageInput(props, ref) {

  const {store, dispatch} = useAppReducer();
  const [isAutocompleting, setIsAutocompleting] = useState(false);
  const [autocompletePlaceholder, setAutocompletePlaceholder] = useState('');
  const [textToAutocomplete, setTextToAutocomplete] = useState('');
  const [canSendMessage, setCanSendMessage] = useState(false);
  const { messageReplying, setMessageReplying } = useChatInput();

  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [appendedMedia, setAppendedMedia] = useState([]);

  const [invalidFiles, setInvalidFiles] = useState([]);

  const [historyIndex, setHistoryIndex] = useState(0);
  const focusedRow = useRef(0);
  const fileInputRef = useRef(null);

  const CHAT_COMMANDS_ACTIONS = {

    '/commands': () => {
      dispatch(appendMessage({
        date: Date.now(),
        from: '@senders/APP_INFO',
        text: <AvailableCommandsTable/>
      }));
    },
    '/create': (args) => {
      if (store.room_code) {
        dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
      }
      else if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-code>, given ${args.length}`}));
      }
      else {
        let room_name = args[0];
        emitSocketEvent['creating-chat-room']({
          room_name: room_name,
          host: {
            user_id: store.user_id,
            user_color: store.user_color
          }
        });
      }
    },
    '/join': (args) => {
      if (store.room_code) {
        dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
      }
      else if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-code>, given ${args.length}`}))
      }
      else  {
        let room_code = args[0];
        emitSocketEvent['joining-to-chat']({
          room_code,
          user: {
            user_id: store.user_id,
            user_color: store.user_color
          },
          from_invitation: false
        })
      }
    },
    '/leave': (args) => {
      if (!store.room_code) {
        dispatch(appendErrorMessage({message: 'You should be on a room first'}));
      }
      else {
        let farewell = args.join(' ');
        emitSocketEvent['leaving-from-chat']({ farewell });
      }
    },
    '/ban': (args) => {
      if (!store.room_code) {
        dispatch(appendErrorMessage({message: 'There are no dummies near, use join to a room first'}));
      }
      else if (store.user_id !== store.host.user_id) {
        dispatch(appendErrorMessage({message: 'Only the host can use the ban hammer!'}));
      }
      else if (args.length === 0 || args.length > 2) {
        dispatch(appendErrorMessage({message: `Expected one or two arguments for <dummy-user> <reason>, given ${args.length}`}));
      }
      else {
        let dummyId = args[0];
        let banReason = args[1];

        if (store.users.some(user => user.user_id === dummyId))
          emitSocketEvent['banning-user']({user_id: dummyId, reason: banReason});
        else dispatch(appendErrorMessage({message: `This is shameful, ${dummyId} does'nt exist`}));
      }
    },
    '/clear': () => {
      dispatch(clearChat());
    },
    '/ping': () => {
      emitSocketEvent['ping']();
    },
    'send_message': (message, mediaData = []) => {
      let date = new Date().toUTCString();
      let message_id = nanoid();
      // If is not connected, only appends the message
      if (!store.room_code) {
        dispatch(appendMessage({
          date,
          from: '@senders/SELF',
          text: message,
          message_id,
          replyingTo: messageReplying,
          media: mediaData
        }));
      }
      else {
        dispatch(appendMessage({
          date,
          from: '@senders/SELF',
          text: message,
          message_id,
          replyingTo: messageReplying,
          media: mediaData
        }));
        emitSocketEvent['sending-message']({
          date,
          message,
          message_id,
          replyingTo: messageReplying,
          media: mediaData
        })
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent new line or page reload on submit
    let user_input = ref.current.value.trim();
    if (!user_input) return;

    if (user_input.startsWith('/')) {
      let words   = user_input.split(' ');
      let command = words[0];
      let args    = words.slice(1);

      if (!CHAT_COMMANDS_ACTIONS.hasOwnProperty(command)) {
        dispatch(appendErrorMessage({message: `Command '${command}' not recognized, type "/commands" for a hug`}));
      }
      else {
        CHAT_COMMANDS_ACTIONS[command](args);
      }
    }
    else {
      const formData = new FormData();

      if (appendedMedia.length > 0) {

        appendedMedia.forEach(mediaFile => {
          console.log('Appended media:', appendedMedia)
          let fileName = mediaFile.name.replace(/(\.\w+)$/, '').replaceAll(' ', '-');
          console.log('working with', fileName);
          formData.append(fileName, mediaFile);
        })

        fetch(`${MEDIA_API_URL}/media`, {
          method: 'POST',
          body: formData
        }).then(response => response.json())
          .then(media => {
            console.log('RECEIVED RESPONSE FROM POST', media);
            CHAT_COMMANDS_ACTIONS['send_message'](user_input, media);

            // cleaning all files
            fileInputRef.current.value = null;
            mediaPreviews.forEach(preview => URL.revokeObjectURL(preview.blobSrc));
            setAppendedMedia([]);
            setMediaPreviews([]);
          })
      }
      else {
        CHAT_COMMANDS_ACTIONS['send_message'](user_input);
      }
    }
    ref.current.value = '';
    clearReplying();
    dispatch(saveLineToHistory({line: user_input}));
    setHistoryIndex(0);
  }

  const handleAutocomplete = () => {
    let availableCommands = [
      {
        key: '/commands',
        arguments: []
      },
      {
        key: '/create',
        arguments: ['<room-name>']
      },
      {
        key: '/join',
        arguments: ['<room-code>']
      },
      {
        key: '/leave',
        arguments: ['<farewell?>']
      },
      {
        key: '/ban',
        arguments: ['<dummy-user>', '<reason>']
      },
      {
        key: '/clear',
        arguments: []
      },
      {
        key: '/ping',
        arguments: []
      }
    ];
    let userInput = ref.current.value;

    if (userInput.trim() === '') {
      setCanSendMessage(false);

      setIsAutocompleting(false);
      setAutocompletePlaceholder('');
      setTextToAutocomplete('');
      return;
    }
    setCanSendMessage(true);

    if (userInput.trim().startsWith('/')) {
      
      setIsAutocompleting(true);
      if (userInput === '/') {
        setAutocompletePlaceholder('/commands');
        setTextToAutocomplete('/commands');
        return;
      }
      let userCommand = userInput.split(' ')[0];
      let userArguments = userInput.split(' ').slice(1).filter(arg => arg.length > 0)

      for (let command of availableCommands) {

        if (userCommand === command.key) {

          // has no arguments
          if (userArguments.length === 0 && userInput === command.key + ' ') {
            setAutocompletePlaceholder(command.key + ' ' + command.arguments.join(' '));
            setTextToAutocomplete('');
            break;
          }
          else {
            if (command.key === '/ban') {
              let availableUsers = store.users.map(user => user.user_id).filter(user_id => store.user_id !== user_id);
              let matchedUser = '';

              if (userArguments.length === 1) {
                for (let user_id of availableUsers) {
                  if (user_id.startsWith(userArguments[0]))
                    matchedUser = user_id;
                }
                matchedUser ||= userArguments[0];
                setAutocompletePlaceholder(command.key + ' ' + matchedUser + ' <reason>')
                setTextToAutocomplete(command.key + ' ' + matchedUser);
              }
              else if (userArguments.length === 2) {
                setAutocompletePlaceholder('')
                setTextToAutocomplete('');
              }
            }
            else {
              setAutocompletePlaceholder(command.key);
              setTextToAutocomplete('');
            }
            break;
          }
        }
        else if (command.key.startsWith(userInput)) {
          setAutocompletePlaceholder(command.key);
          setTextToAutocomplete(command.key);
          break;
        }
        else {
          setAutocompletePlaceholder('');
          setTextToAutocomplete('');
        }
      }
    }
    else {
      setIsAutocompleting(false);
      setAutocompletePlaceholder('');
      setTextToAutocomplete('');
    }
  }
  const handleNewLine = () => {
    focusedRow.current = ref.current.value.substring(0, ref.current.selectionEnd).split('\n').length;
  }
  const clearReplying = () => {
    setMessageReplying(null);
  }

  const handleKeys = (e) => {
    if (e.shiftKey) return;

    focusedRow.current = ref.current.value.substring(0, ref.current.selectionEnd).split('\n').length;
    let total_rows = ref.current.value.split('\n').length;

    switch (e.key) {
      case 'Enter':
        handleSubmit(e);
      break;
      case 'Tab':
        e.preventDefault();
        if (isAutocompleting && textToAutocomplete) {
          ref.current.value = textToAutocomplete;
        }
      break;

      case 'ArrowUp':
        // "If exist the line on history AND (the input has multiple lines and you are on the top OR you have only one line)"
        if ((store.commands_history.at(historyIndex-1) !== undefined)
          && ((total_rows > 0 && ref.current.selectionStart === 0) || (historyIndex === 0 && ref.current.selectionStart === 0) || (total_rows === 1 && historyIndex !== 0))) {

          ref.current.value = store.commands_history.at(historyIndex-1);
          setHistoryIndex(prev => prev-1);
          ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
        }
        break;
      case 'ArrowDown':
        // "If exist the line on history AND the index will not go out of range AND caret is in the bottom row"
        if ((store.commands_history.at(historyIndex+1) !== undefined)
          && (historyIndex < -1)
          && (focusedRow.current === total_rows)) {

          ref.current.value = store.commands_history.at(historyIndex+1);
          setHistoryIndex(prev => prev+1);
          ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
        }
        break;
      default:
        if (store.room_code && e.key.length === 1 && !e.key.match(/(control|shift|alt)/i) && waiterEnded.next().value)
          emitSocketEvent['typing-message']();
    }
    handleAutocomplete(e);
  };
  useEffect(() => {
    handleAutocomplete();
  }, [ref.current?.value])

  const areInvalidFiles = (files) => {
    console.log('Validating files...', files);
    const invalidFilesInfo = [];
    for (let file of Array.from(files)) {
      if (!file.type) invalidFilesInfo.push({
        name: file.name,
        reason: "We don't know the reason yet"
      });
    }
    if (invalidFilesInfo.length > 0) {
      console.log('Founded invalid files:', invalidFilesInfo)
      setInvalidFiles(invalidFilesInfo);
      return true;
    }
    else return false;
  }
  /**
   * @param {FileList | File[]} newFilesAppended List of files as a FileList object
   */
  const appendNewFileAndUpdate = (newFilesAppended) => {
    if (areInvalidFiles(newFilesAppended)) return;

    setAppendedMedia(prevMedia => {
      const updatedAppendedMedia = prevMedia.concat(Array.from(newFilesAppended));
      const mediaPreviews = [];

      console.log('Updated: ', updatedAppendedMedia);
      updatedAppendedMedia.forEach((file) => {
        console.log('Blobbing...', file)
        const imgBlobPreview = URL.createObjectURL(file); // TODO: Revoke object URL
        mediaPreviews.push({
          blobSrc: imgBlobPreview,
          type: file.type,
          title: file.name
        });
      })
      setMediaPreviews(mediaPreviews);
      return updatedAppendedMedia;
    });

  }

  const handleInputPaste = (e) => {
    console.log(e.clipboardData.files);
    if (e.clipboardData.files.length > 0) {
      appendNewFileAndUpdate(e.clipboardData.files);
    }
  }
  const handleFileSubmit = ({ currentTarget: filesInput }) => {
    console.log('Reading files for previews:', filesInput);
    appendNewFileAndUpdate(filesInput.files);
  }
  const handleFilesDropped = (files) => {
    appendNewFileAndUpdate(files);
  }

  return (
    <>
      <InvalidFilesOverlay invalidFiles={invalidFiles} onClose={() => setInvalidFiles([])}/>
      <FilesDropArea onDrop={handleFilesDropped}/>
      <form onSubmit={handleSubmit}>
        {
          messageReplying &&
          <div className='message-replying-container'>
            <div>
              Replying to <span className={`${messageReplying.color}`}>{messageReplying.from}</span>
            </div>
            <button onClick={clearReplying}>x</button>
          </div>
        }
        <MultimediaPreview mediaPreviews={mediaPreviews}/>
        <div className='chat-input-container'>
          <div className='input-wrapper'>
            <TextareaAutosize
              maxRows={12}
              className='textarea-input'
              ref={ref}
              placeholder={'Type something'}
              onChange={handleAutocomplete}
              onFocus={handleAutocomplete}
              onBlur={handleAutocomplete}
              onKeyDown={handleKeys}
              onHeightChange={handleNewLine}
              onPaste={handleInputPaste}
            />
            <div className='autocomplete'
            >{autocompletePlaceholder}</div>
          </div>
          <div className='send-message-container'>
            <input
              type='file'
              multiple
              ref={fileInputRef}
              onChange={handleFileSubmit}
              accept='image/*,video/mp4,video/3gpp,video/quicktime'
            />
            <HoverableTitle title='Send'>
              <button type='submit' className='send-message-btn' disabled={!canSendMessage}>
                <IoSend/>
              </button>
            </HoverableTitle>
          </div>
        </div>
      </form>
    </>
  )
}

export default forwardRef(ChatMessageInput);

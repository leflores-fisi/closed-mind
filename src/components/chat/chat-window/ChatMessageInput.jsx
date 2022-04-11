import { useState, forwardRef, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { emitSocketEvent } from '@/services/userSocket';
import useAppReducer       from '@/hooks/useAppReducer';
import useChatInput        from '@/hooks/useChatInput';
import { CLOUD_API_URL }   from '@/services/userSocket';
import HoverableTitle      from '@/components/overlay/HoverableTitle';
import { waitForSeconds }  from '@/Helpers';

import { saveLineToHistory, appendMessage, appendErrorMessage, clearChat } from '@/context/actions';
import TextareaAutosize from 'react-textarea-autosize';
import AvailableCommandsTable from './statics/AvailableCommandsTable';
import { MdAddCircleOutline } from 'react-icons/md';
import AttachmentsPreview     from './AttachmentsPreview';
import InvalidFilesOverlay    from './InvalidFilesOverlay';
import FilesDropArea          from './chat-interactive/FilesDropArea';
import { IoSend } from 'react-icons/io5';
import './ChatInput.scss';

const waiterEnded = waitForSeconds(2);

// forward ref
function ChatMessageInput(_props, ref) {

  const { store, dispatch } = useAppReducer();
  const [isAutocompleting, setIsAutocompleting] = useState(false);
  const [autocompletePlaceholder, setAutocompletePlaceholder] = useState('');
  const [textToAutocomplete, setTextToAutocomplete] = useState('');
  const [canSendMessage, setCanSendMessage] = useState(false);
  const { messageReplying, setMessageReplying } = useChatInput();

  const [appendedAttachments, setAppendedAttachments] = useState([]);
  const [filesAreInvalid, setFilesAreInvalid] = useState(null);

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
    'send_message': (message, attachmentsList = []) => {
      let date = new Date().toUTCString();
      let message_id = nanoid();
      // If is not connected, only appends the message
      if (!store.room_code) {
        dispatch(appendMessage({
          date: date,
          from: '@senders/SELF',
          text: message,
          message_id: message_id,
          replyingTo: messageReplying,
          filesToSubmit: attachmentsList
        }));
      }
      else {
        if (attachmentsList.length > 0) {
          dispatch(appendMessage({
            date: date,
            from: '@senders/SELF',
            text: message,
            message_id: message_id,
            replyingTo: messageReplying,
            filesToSubmit: attachmentsList
          }));
        }
        else {
          dispatch(appendMessage({
            date: date,
            from: '@senders/SELF',
            text: message,
            message_id: message_id,
            replyingTo: messageReplying
          }));
          emitSocketEvent['sending-message']({
            date: date,
            message: message,
            message_id: message_id,
            replyingTo: messageReplying
          })
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent new line or page reload on submit
    let user_input = ref.current.value.trim();
    if ((!user_input && appendedAttachments.length === 0) || !canSendMessage) return;

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
      if (appendedAttachments.length > 0) {
        // Here we don't revoke the blob,
        // first we wait for the post to cloudinary on SelfMessageLine
        CHAT_COMMANDS_ACTIONS['send_message'](user_input, appendedAttachments);
        fileInputRef.current.value = null;
        setAppendedAttachments([]);
      }
      else {
        CHAT_COMMANDS_ACTIONS['send_message'](user_input);
      }
    }
    ref.current.value = '';
    clearReplying();
    dispatch(saveLineToHistory({line: user_input}));
    setHistoryIndex(0);
    setCanSendMessage(false);
  }

  const handleAutocomplete = () => {
    let availableCommands = [
      {
        key: '/commands',
        arguments: []
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

    if (userInput.trim() === '' && appendedAttachments.length === 0) {
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


  const areInvalidFiles = (currentFiles, newFiles) => {
    const MAX_FILE_SIZE = 10485760;
    const MAX_FILES_AMOUNT = 15;
    let invalidReason = '';

      console.log('VALIDATING WITH FILES:', currentFiles)
      if (currentFiles.length + newFiles.length > MAX_FILES_AMOUNT) {
        invalidReason = 'We have a limit of 15 files per message';
      }
      for (let file of Array.from(newFiles)) {
        if (file.size >= MAX_FILE_SIZE) {
          invalidReason = `${file.name} is too large`;
        }
        else if (file.isDirectory) {
          invalidReason = `${file.name} is a folder, and is weird`;
        }
      }

    if (invalidReason) {
      setFilesAreInvalid({ reason: invalidReason });
      console.log('Founded invalid files:', invalidReason);
      return true;
    }
    else return false;
  }
  /**
   * @param {FileList | File[]} newAttachments List of files as a FileList object
   */
  const appendNewFileAndUpdate = (newAttachments) => {

    setAppendedAttachments(currentAttachments => {
      if (areInvalidFiles(currentAttachments, newAttachments))
        return currentAttachments;
      // Creating blobs for each new file
      // The blobs will been revoke on submit or on removing file from preview
      Array.from(newAttachments).forEach((file) => {
        if (file.type.includes('image') || file.type.includes('video')) {
          console.log('Blobbing...', file)
          const imgBlobPreview = URL.createObjectURL(file); // TODO: Revoke object URL
          file.blobSrc = imgBlobPreview;
        }
      })
      if (!canSendMessage) setCanSendMessage(true);
      return currentAttachments.concat(Array.from(newAttachments));
    });
  }
  const removeFileFromPreview = (index) => {
    setAppendedAttachments(currentAttachments => (
      currentAttachments.filter((file, i) => {
        if (i === index) {
          console.log('Removing blob', file.blobSrc);
          if (file.blobSrc) URL.revokeObjectURL(file.blobSrc);
          return false;
        }
        return true;
      })
    ))
  }

  const handleInputPaste = (e) => {
    console.log('Handling files pasted', e.clipboardData.files);
    if (e.clipboardData.files.length > 0) {
      appendNewFileAndUpdate(e.clipboardData.files);
    }
  }
  const handleFileSubmit = ({ currentTarget: filesInput }) => {
    console.log('Reading files for previews:', filesInput);
    appendNewFileAndUpdate(filesInput.files);
  }
  const handleFilesDropped = (files) => {
    console.log('Handling files dropped', files);
    appendNewFileAndUpdate(files);
  }

  return (
    < >
      <InvalidFilesOverlay filesAreInvalid={filesAreInvalid} onClose={() => setFilesAreInvalid(null)}/>
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
        <AttachmentsPreview attachments={appendedAttachments} fileRemover={removeFileFromPreview}/>
        <div className='chat-input-container'>
          <div className='add-files-container'>
            <input
              className='file-input'
              type='file'
              multiple
              ref={fileInputRef}
              onChange={handleFileSubmit}
            />
            <HoverableTitle title='Add files'>
              <button className='add-files-btn' type='button' onClick={() => fileInputRef.current.click()}>
                <MdAddCircleOutline/>
              </button>
            </HoverableTitle>
          </div>
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
            <div className='autocomplete notranslate' translate='no'
            >{autocompletePlaceholder}</div>
          </div>
          <div className='send-message-container'>
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

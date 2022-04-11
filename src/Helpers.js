

export function isURL(str) {
  return (
    (str.startsWith('http://') || str.startsWith('https://')) &&
    (str.includes('.') && str.at(-1) !== '.')
  );
}

export function isYoutubeURL(URL) {
  return (
    URL.startsWith('https://www.youtube.com/watch?') ||
    URL.startsWith('https://youtube.com/watch?') ||
    URL.startsWith('https://youtube.com/shorts/') ||
    URL.startsWith('https://www.youtube.com/shorts/') ||
    URL.startsWith('https://www.youtube.com/playlist?list') ||
    URL.startsWith('https://youtu.be/') ||
    URL.startsWith('https://www.youtu.be/')
  )
}

export function getYoutubeID(YOUTUBE_URL) {
  let queries = ['watch?v=', 'shorts/', 'youtu.be/', 'playlist?list='];
  let videoID;
  
  queries.forEach((query, i) => {
    if (YOUTUBE_URL.includes(query)) {
      let youtubeIdLength = (i === 3 ? 34 : 11);
			let start = YOUTUBE_URL.indexOf(query)+query.length
  		videoID = YOUTUBE_URL.substring(start, start + youtubeIdLength);
    }
  })
  return videoID;
}

export function isEmptyObject(obj) {
  if (typeof obj !== 'object') return false;
  for (let i in obj) return false;
  return true;
}

export function scrollChatIfIsNear(distance = 200) {
  const Wrapper = document.querySelector('.chat-lines-wrapper');
  const LinesHeight = document.querySelector('.chat-lines').getBoundingClientRect().height;

  if (LinesHeight - (Wrapper.scrollTop + Wrapper.getBoundingClientRect().height) < distance) {
    setTimeout(() => {
      Wrapper.scrollTo(0, LinesHeight);
    }, 0)
  }
}

export function scrollChatToBottom() {
  const Wrapper = document.querySelector('.chat-lines-wrapper');
  const LinesHeight = document.querySelector('.chat-lines').getBoundingClientRect().height;
  Wrapper.scrollTo(0, LinesHeight);

  console.log('Scrolling chat to bottom')
}

export function writeOnChatInput(text) {
  let ChatInput = document.querySelector('.textarea-input');
  ChatInput.value = text;
  ChatInput.focus();
}

export function* waitForSeconds(seconds) {
  let initial = Date.now();
  yield true;

  while (true) {
    if ((Date.now() - initial) > seconds*1000) {
      initial = Date.now();
      yield true;
    }
    else yield false;
  }
}

export function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      }
      catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return prompt("Copy to clipboard: Ctrl+C, Enter", text);
      }
      finally {
          document.body.removeChild(textarea);
      }
  }
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date) {

  console.log('Formatting', date);
  if (!date) return {
    hour: '??:??',
    day: '1970-01-01'
  };

  let d = new Date(date);
  
  let hour   = new Intl.DateTimeFormat('en',   { hour: '2-digit', hour12: false }).format(d);
  let minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);

  let year  = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let day   = new Intl.DateTimeFormat('en', { day: '2-digit'  }).format(d);
  let month = new Intl.DateTimeFormat('en', { day: '2-digit'  }).format(d);
  
  return {
    hour: `${hour.replace(/ PM| AM/, '')}:${minute}`,
    day: `${year}-${month}-${day}`
  };
}

export function getRoomsHistory() {
  return JSON.parse(localStorage.getItem('rooms_history')) || [];
}

export function removeRoomFromHistory(room_code) {
  let currentRooms = getRoomsHistory();
  let updatedRoom = currentRooms.filter(room => room.code !== room_code);
  localStorage.setItem('rooms_history', JSON.stringify(updatedRoom));
  return updatedRoom;
}

export function saveRoomToHistory(room_name, room_code, logged_as, user_color) {

  let currentRooms = getRoomsHistory();
  let roomToSave = {
    name: room_name,
    code: room_code,
    logged_as: logged_as,
    user_color: user_color
  }

  if (currentRooms && Array.isArray(currentRooms)) {
    // If already exist that code on the history, we delete it and create a new one
    if (currentRooms.map(room => room.code).includes(room_code)) {
      let codeIndexToReplace = currentRooms.findIndex(room => room.code === room_code);

      localStorage.setItem('rooms_history',
        JSON.stringify(
          currentRooms.filter((_, i) => i !== codeIndexToReplace).concat(roomToSave)
        )
      );
    }
    else localStorage.setItem('rooms_history', JSON.stringify(currentRooms.concat(roomToSave)));
  }
  else {
    localStorage.setItem('rooms_history', JSON.stringify(Array(roomToSave)));
  }
}

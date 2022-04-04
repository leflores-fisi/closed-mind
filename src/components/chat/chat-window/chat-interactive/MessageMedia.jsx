
function MessageMedia({ media }) {
  
  return (
    media.length > 0 &&
    <div className='message-media'>
      {
        media.map(resource => (
          <div className='media-wrapper'>
            <img src={resource.url}/>
          </div>
        ))
      }
    </div>
  );
}
export default MessageMedia;

function YoutubeEmbed({ id, isPlaylist }) {
  
  return (
    <div className='youtube-embed'>
      <iframe
        width='400'
        height='225'
        src={isPlaylist ? `https://www.youtube.com/embed/videoseries?list=${id}` : `https://www.youtube.com/embed/${id}`}
        title='YouTube video player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen={true}>
      </iframe>
    </div>
  );
}
export default YoutubeEmbed;
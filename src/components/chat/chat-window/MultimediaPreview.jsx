
function MultimediaPreview({ mediaPreviews }) {

  return (
    <div className='media-preview'>
      {
        mediaPreviews.map((preview, i) => (
          <div key={i}>
            <div>{preview.title}</div>
            {
              preview.type.includes('image')
              ? <img src={preview.blobSrc}/>
              : <video controls>
                  <source src={preview.blobSrc} type={preview.type}/>
                </video>
            }
          </div>
        ))
      }
    </div>
  );
}
export default MultimediaPreview;
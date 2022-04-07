
function MultimediaPreview({ mediaPreviews, fileRemover }) {

  return (
    <div className='media-preview'>
      {
        mediaPreviews.map((preview, i) => (
          <div className='file-preview-container' key={i}>
            <div className='remove-file-btn'>
              <button onClick={() => fileRemover(i)}>x</button>
            </div>
            <div className='file-container'>
              <div className='file'>
                {
                  preview.type.includes('image')
                  ? <img src={preview.blobSrc}/> :

                  preview.type.includes('video')
                  ? <video controls>
                      <source src={preview.blobSrc} type={preview.type}/>
                    </video>

                  : <div>
                      <a href={preview.blobSrc}></a>
                      <div>{preview.type}</div>
                    </div>
                }
              </div>
            </div>
            <div className='file-name'>
              <div className='text'>{preview.title}</div>
            </div>
          </div>
        ))
      }
    </div>
  );
}
export default MultimediaPreview;
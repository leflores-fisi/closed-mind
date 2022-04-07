
function MultimediaPreview({ mediaPreviews, fileRemover }) {

  return (
    <div className='media-preview'>
      {
        mediaPreviews.map((preview, i) => (
          <div key={i}>
            <div>
              {preview.title}
            </div>
            <div>
              <div>
                <button onClick={() => fileRemover(i)}>x</button>
              </div>
              {
                preview.type.includes('image')
                ? <img src={preview.blobSrc}/>
                : <video controls>
                    <source src={preview.blobSrc} type={preview.type}/>
                  </video>
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}
export default MultimediaPreview;
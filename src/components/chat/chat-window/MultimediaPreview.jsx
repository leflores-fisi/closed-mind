import { formatBytes } from '@/Helpers';
import { AiFillFileText } from 'react-icons/ai';

function MultimediaPreview({ mediaPreviews, fileRemover }) {

  return (
    <div className='media-preview'>
      {
        mediaPreviews.map((preview, i) => (
          <figure className='file-preview-container' key={i}>
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

                  : <div className='without-preview'>
                      <AiFillFileText size={70}/>
                      <div className='file-type'>{preview.type}</div>
                      <div className='file-size'>{formatBytes(preview.size)}</div>
                    </div>
                }
              </div>
            </div>
            <figcaption className='file-name'>
              <div className='text'>{preview.name}</div>
              <div>{`(${i+1})`}</div>
            </figcaption>
          </figure>
        ))
      }
    </div>
  );
}
export default MultimediaPreview;
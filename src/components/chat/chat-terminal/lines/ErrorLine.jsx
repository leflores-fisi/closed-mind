import { useEffect } from 'react';

function ErrorLine({ text }) {

  useEffect(() => {
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines   = document.querySelector('.command-lines');

    Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
  }, [])

  return (
    <div className='error-message'>
      <div>{text}</div>
    </div>
  )
}

export default ErrorLine;
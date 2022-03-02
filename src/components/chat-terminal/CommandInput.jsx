import { forwardRef } from 'react';

function CommandInput(props, ref) {

  return (
    < >
      <div className={'command-line-input'}>
        <span>{'>'}</span>
        <input
          className='command-input'
          ref={ref}>
        </input>
      </div>
    </>
  )
}

export default forwardRef(CommandInput);
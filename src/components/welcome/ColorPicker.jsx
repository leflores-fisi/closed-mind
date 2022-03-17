import './ColorPicker.scss'

function ColorPicker({onPick}) {

  // css variables (see index.scss)
  const colors = ['red', 'brightRed', 'yellow', 'brightYellow', 'green', 'brightGreen', 'cyan', 'brightCyan', 'blue', 'brightBlue', 'purple', 'brightPurple'];

  return (
    <div className='color-picker'>
      {
        colors.map(color => (
          <button
            type='button'
            key={color}
            className={`color bg-${color}`}
            onClick={() => {
              onPick(color);
            }}>
          </button>
        ))
      }
    </div>
  )
}

export default ColorPicker;
import { useState, useEffect } from 'react';
import './ColorPicker.scss'

function ColorPicker({onPick}) {

  // css variables (see index.scss)
  const colors = ['red', 'brightRed', 'yellow', 'brightYellow', 'green', 'brightGreen', 'cyan', 'brightCyan', 'blue', 'brightBlue', 'purple', 'brightPurple'];
  const [selectedColor, setSelectedColor] = useState();

  // Random color pick
  useEffect(() => {
    let random_index = ~~(Math.random() * colors.length);
    let random_color = colors[random_index];
    setSelectedColor(random_color);
    onPick(random_color);
  }, [])

  return (
    <div className='color-picker'>
      {
        colors.map(color => (
          <button
            type='button'
            key={color}
            className={`color bg-${color} ${selectedColor === color ? 'selected' : ''}`}
            onClick={(e) => {
              onPick(color);
              setSelectedColor(color);
            }}>
          </button>
        ))
      }
    </div>
  )
}

export default ColorPicker;
import closedmind_logo from './../assets/closedmind-logo.png';

function ClosedmindLogo({ width, height, opacity }) {

  return (
    <img
      className='img-logo'
      src={closedmind_logo}
      draggable={false}
      style={{opacity: opacity || 1}}
      width={width}
      height={height}
    />
  );
}
export default ClosedmindLogo;
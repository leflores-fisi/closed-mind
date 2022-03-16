
function ClosedmindHeader({ description = false }) {
  
  return (
    <header className='welcome-header'>
      {
        description
          ? <picture className='closedmind-logo'>
              <img src='/src/assets/closedmind-logo.png'/>
              <div>
                <div style={{fontSize: 16}}>closed mind</div>
                <div className='desc' style={{fontSize: 12}}>minimalist and fugacious communication</div>
              </div>
            </picture>
          : <picture className='closedmind-logo'>
              <img src='/src/assets/closedmind-logo.png' draggable={false}/>
              <div>closed mind</div>
            </picture>
      }
      <div className='closedmind-github'>
        <a target='_blank' href='https://github.com/leflores-fisi/closed-mind'>
          <img src='/src/assets/github-logo.png' draggable={false}/>
        </a>
      </div>
    </header>
  );
}
export default ClosedmindHeader;
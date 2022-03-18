import closedmind_logo from './../assets/closedmind-logo.png';
import github_logo from './../assets/github-logo.png';
import HoverableTitle from './overlay/HoverableTitle';

function ClosedmindHeader({ description = false }) {
  
  return (
    <header className='welcome-header'>
      {
        description
          ? <picture className='closedmind-logo'>
              <img src={closedmind_logo}/>
              <div>
                <div style={{fontSize: 16}}>closedmind</div>
                <div className='desc' style={{fontSize: 12}}>minimalist and fugacious communication</div>
              </div>
            </picture>
          : <picture className='closedmind-logo'>
              <img src={closedmind_logo} draggable={false}/>
              <div>closedmind</div>
            </picture>
      }
      <HoverableTitle title={'Closedmind repository'} direction='down'>
        <div className='closedmind-github'>
          <a target='_blank' href='https://github.com/leflores-fisi/closed-mind'>
            <img src={github_logo} draggable={false}/>
          </a>
        </div>
      </HoverableTitle>
    </header>
  );
}
export default ClosedmindHeader;
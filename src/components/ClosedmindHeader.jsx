import github_logo from '@/assets/logos/github.png';
import ClosedmindLogo from './ClosedmindLogo';
import HoverableTitle from './overlay/HoverableTitle';

function ClosedmindHeader({ description = false }) {
  
  return (
    <header className='welcome-header'>
      {
        <picture className='closedmind-logo'>
          <ClosedmindLogo/>
            {
              description
              ? <div>
                  <div style={{fontSize: 16}} className='notranslate' translate='no'>closedmind</div>
                  <div className='desc' style={{fontSize: 12}}>minimalist and fugacious communication</div>
                </div>
              : <div className='notranslate' translate='no'>closedmind</div>
            }
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
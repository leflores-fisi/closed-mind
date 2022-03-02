import UserForm from './UserForm';
import './Welcome.scss';

function WelcomeWindow() {

  return (
    <div className='welcome'>
      <div className='logo'>〰CLOSED MIND〰</div>
      <div className='slogan'>
        A secure text messaging for the 21<sup>st</sup> century
      </div>
      <div className='cards'>
        <div className='card'><UserForm/></div>
        <div className='card'>
          <div className='features'>
            <div className='commands'>
              <div>{`/create`}</div>
              <div>{`/connect`}</div>
              <div>{`/leave`}</div>
              <div>{`/ban`}</div>
            </div>
            <div className='arguments'>
              <div>{`<room-id>`}</div>
              <div>{`<room-id>`}</div>
              <div>{`<farewell>`}</div>
              <div>{`<poor-user>`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeWindow;
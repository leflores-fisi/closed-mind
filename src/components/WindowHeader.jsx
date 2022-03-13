
function Header({ title, side }) {
  return (
    <header className='window-header'>
      <div className='window-title' title={title}>{title}</div>
      {side}
    </header>
  )
}
export default Header;



function Header({ title }) {
  return (
    <header className='window-header'>
      <div className='window-title' title={title}>{title}</div>
    </header>
  )
}
export default Header;


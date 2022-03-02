
function SidebarSection({title, content}) {
  return (
    <div className='sidebar-section code'>
      <div className='title'>{title}</div>
      <div className='content'>
        {content}
      </div>
    </div>
  )
}

export default SidebarSection;
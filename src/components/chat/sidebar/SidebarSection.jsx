
function SidebarSection({title, content}) {
  return (
    <section className='sidebar-section code'>
      <div className='title'>{title}</div>
      <div className='content'>
        {content}
      </div>
    </section>
  )
}

export default SidebarSection;
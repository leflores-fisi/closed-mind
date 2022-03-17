
function ErrorLine({ text }) {

  console.log('error')

  return (
    <div className='command-line error-message'>
      <div>{text}</div>
    </div>
  )
}

export default ErrorLine;
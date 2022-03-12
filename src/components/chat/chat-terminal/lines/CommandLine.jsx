import { useEffect, memo } from 'react';

function CommandLine({ children }) {

  useEffect(() => {
    console.log('🦧 Rendered last command line');
  }, [])

  return (
    <>{children}</>
  )
}

export default memo(CommandLine);
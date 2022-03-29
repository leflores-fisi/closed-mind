
function AvailableCommandsTable() {
  
  return (
    <table className='commands-snippets'>
      <tr>
        <th>Command</th>
        <th>Arguments</th>
        <th>Description</th>
      </tr>
      <tr>
        <td className='brightCyan'>/create</td>
        <td className='brightBlack'>{'<room-name>'}</td>
        <td>create a new chat room</td>
      </tr>
      <tr>
        <td className='brightCyan'>/join</td>
        <td className='brightBlack'>{'<room-code>'}</td>
        <td>join to a existing room</td>
      </tr>
      <tr>
        <td className='brightCyan'>/leave</td>
        <td className='brightBlack'>{'<farewell?>'}</td>
        <td>leave from the current room</td>
      </tr>
      <tr>
        <td className='brightCyan'>/ban</td>
        <td className='brightBlack'>{'<id> <reason>'}</td>
        <td>ban some dummies</td>
      </tr>
      <tr>
        <td className='brightCyan'>/clear</td>
        <td className='brightBlack'>{'—'}</td>
        <td>clear the current messages</td>
      </tr>
      <tr>
        <td className='brightCyan'>/ping</td>
        <td className='brightBlack'>{'—'}</td>
        <td>see how far is our server</td>
      </tr>
    </table>
  );
}
export default AvailableCommandsTable;

function AvailableCommandsTable() {
  
  return (
    <table className='commands-snippets'>
      <tr>
        <th>Command</th>
        <th>Arguments</th>
        <th>Description</th>
      </tr>
      <tr>
        <td className='brightCyan notranslate' translate='no'>/leave</td>
        <td className='brightBlack'>{'<farewell?>'}</td>
        <td>leave from the current room</td>
      </tr>
      <tr>
        <td className='brightCyan notranslate' translate='no'>/ban</td>
        <td className='brightBlack'>{'<id> <reason>'}</td>
        <td>ban some dummies</td>
      </tr>
      <tr>
        <td className='brightCyan notranslate' translate='no'>/clear</td>
        <td className='brightBlack'>{'—'}</td>
        <td>clear the current messages</td>
      </tr>
      <tr>
        <td className='brightCyan notranslate' translate='no'>/ping</td>
        <td className='brightBlack'>{'—'}</td>
        <td>see how far is our server</td>
      </tr>
    </table>
  );
}
export default AvailableCommandsTable;
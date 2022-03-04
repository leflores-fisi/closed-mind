
function validateUsername(username) {
  if      (username === '')        return 'You need a username, try something nice';
  else if (username.length < 3)    return 'Username is too short, even for me';
  else if (username.length > 16)   return 'Username is too long, we have standards';
  else if (username.includes('#')) return 'Hashes (#) are not allowed, they could break us';
  else return 'OK';
}
module.exports = validateUsername;

function generateInvitationCode() {
  let chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'w', 'y', 'z'];
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += Math.random() < 0.7
    	? numbers[(~~(numbers.length * Math.random()))]
    	: chars[(~~(chars.length * Math.random()))];
  }
  return code;
}
module.exports = generateInvitationCode;
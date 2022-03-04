
function randomIdCode() {
  let chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'w', 'x', 'y', 'z'];
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let id = '';
  
  for (let i = 0; i < 4; i++) {
    id += Math.random() < 0.7
    	? numbers[(~~(numbers.length * Math.random()))]
    	: chars[(~~(chars.length * Math.random()))];
  }
  return '#'+id;
}
module.exports = randomIdCode;

function plainFilesTree(tree) {
  return Object.values(tree).reduce((previous, current) => {
    return previous.concat(current)
  }, []);
}

module.exports = { plainFilesTree };

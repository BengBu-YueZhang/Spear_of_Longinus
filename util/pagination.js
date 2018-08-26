module.exports = function (pagestart, pagesize) {
  const start = ((pagestart - 1) * pagesize) - 1 < 0 ? 0 : ((pagestart - 1) * pagesize) - 1
  const end = (pagestart * pagesize) - 1
  return {
    start,
    end
  }
}

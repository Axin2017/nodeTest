function logErrOrData(err, ...data) {
  if (err) {
    console.error(err);
  } else {
    data.forEach(d => {
      console.log(d);
    })
  }
}

module.exports = {
  logErrOrData
}
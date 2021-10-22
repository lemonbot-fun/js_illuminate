const copy = require('copy');

exports.copy = function (src, to) {
  return new Promise((resolve, reject) => {
    copy(
      src, to,
      (e) => {
        if (e) reject(e);
        else resolve();
      }
    );
  });
}

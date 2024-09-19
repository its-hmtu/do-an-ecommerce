const sanitizeHtml = require('sanitize-html');

exports.sanitizeInput = (input, options) => {
  const defaulOptions = {
    allowedTags: [],
    allowedAttributes: {}
  }

  return sanitizeHtml(input, options || defaulOptions);
}
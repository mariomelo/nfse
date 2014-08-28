var fs = require('fs');
var htmlescape = require('./htmlescape');

module.exports = {
  get_soap_message: function(method, body){
    return get_soap_message(method, body);
  }
}

var get_soap_message = function(method, body){
  var soap_header = fs.readFileSync('./templates/soap_header.xml').toString();
  soap_header = soap_header.replace(/\{\{metodo\}\}/g, method);
  fs.writeFileSync('last_soap_message.xml', soap_header.replace(/\{\{dados\}\}/g, body));
  soap_header = soap_header.replace(/\{\{dados\}\}/g, htmlescape.escape(body));
  return (soap_header);
}
const fs = require('fs');
const path = require('path');

module.exports = {
  menu: JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'menu.json'), 'utf-8')
  ),
};

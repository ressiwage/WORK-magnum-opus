const path = require('path');

module.exports = {
  entry: './main.js', // какой файл собираем
  output: { // куда поместим
    path: path.resolve(__dirname, './'), // путь
    filename: 'main_builded.js', // какое будет имя бандла
  },
};
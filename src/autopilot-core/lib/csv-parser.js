const fs = require('fs'),
      parse = require('csv-parse'),
      util = require('util');

const csvParser = async(csvFile) => {

    const readFile = util.promisify(fs.readFile),
          parser = util.promisify(parse);

    const data = await readFile(csvFile),
          parsedDatas = await parser(data, {
            trim: true,
            skip_empty_lines: true
          });
          
    return parsedDatas;
}

module.exports = csvParser;
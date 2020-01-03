const rp = require('request-promise');
const cheerio = require('cheerio');
const chalk = require('chalk');

class RaceDetails {
  static retrieve(raceId) {
    const url = `https://www.usabmx.com/site/bmx_races/${raceId}`;

    return rp(url).then((html) => {
      return new RaceDetails(html);
    }).catch((err) => {
      console.log(chalk.red(err));
    });
  }

  constructor(html) {
    const $ = cheerio.load(html);

    $('#event_detail > #event_description > ul > li').each((index, element) => {
      const text = $(element).text();
      const values = text.split(': ');
      this[values[0]] = values[1];
    })
  }
}

module.exports = RaceDetails;

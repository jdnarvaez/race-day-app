const rp = require('request-promise');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const url = `https://www.usabmx.com/site/bmx_points?points_type=Gold+Cup&section_id=224&season=2019&segregations%5BREGIONS%5D=North+Central&segregations%5BGROUPS%5D=5+%26+Under+Novice&_=1578108926657#points-query`;

rp(url).then((html) => {
  const $ = cheerio.load(html);
  const age_groups = [];

  $('.points-query.segregations2 > form > #segregations_GROUPS > option').each((index, element) => {
    const value = element.attribs.value;

    if (value !== '') {
      age_groups.push(value);
    }
  });

  fs.writeFileSync(path.resolve(path.join(__dirname, '..', 'docs', 'data', 'age_groups.json')), JSON.stringify(age_groups));
}).catch((err) => {
  console.log(chalk.red(err));
});

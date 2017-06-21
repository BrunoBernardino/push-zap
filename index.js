#! /usr/bin/env node
const fs = require('fs');
const path = require('path');

// Adds a number of spaces as padding
const pad = (string, spaces) => {
  const padding = Array(spaces + 1).join(' ');

  if (typeof string === 'undefined') {
    return padding;
  }

  return (string + padding).substring(0, padding.length);
};

const _ = require('lodash');
const moment = require('moment');
const got = require('got');

const zapsFile = path.join(process.env.HOME, '.push-zaps.json');

// Check if file exists first
if (!fs.existsSync(zapsFile)) {
  try {
    fs.writeFileSync(zapsFile, '{}');
    console.log(`Wrote clean/empty "${zapsFile}"...`);
  } catch (e) {
    console.log(`-- Oops!

It seems I can't write to "${zapsFile}".
Can you please run \`echo "{}" > "${zapsFile}"\` to create it, or allow me access?
`);
    return process.exit(-1);
  }
}

const zaps = require(zapsFile);

const timestamp = moment.utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');

const payload = {
  timestamp,
};

// No command
if (process.argv.length <= 2) {
  console.log(`-- Oops!

It seems I didn't see a command or Zap-ID.
Try \`push-zap list\` to see your Zaps, and \`push-zap Zap-ID [text]\` to run one.
`);
  return process.exit(-1);
}

// Help
if (process.argv[2] === 'help' || process.argv[2] === '-h' || process.argv[2] === '--help') {
  console.log(`-- Help

Usage: \`push-zap <command|Zap-ID> [<text>]\`.

Commands:

  - help: This command. Shows this screen.
  - list: Lists the Zaps I know about.
  - add: Creates the definition for a new Zap. \`<text>\` would become need to be \`<Zap-ID> <Title> <Requires Text? (true/false)> <Webhook URL>\`

NOTE: To add more zaps, edit your ~/.push-zaps.json file.
`);
  return process.exit(-1);
}

// List
if (process.argv[2] === 'list' || process.argv[2] === '-l' || process.argv[2] === '--list') {
  const zapList = [];

  _.each(zaps, (zap, key) => {
    zapList.push(`${pad(key, 15)} | ${pad(zap.title, 25)} | ${pad(zap.text, 5)} | ${zap.webhook}`);
  });

  console.log(`-- Zaps List

  ======================================================================
    ${pad('Zap-ID', 15)} | ${pad('Title', 25)} | Text? | Webhook URL
  ======================================================================

  - ${zapList.join('\n  - ')}
`);
  return process.exit(-1);
}

// Add
if (process.argv[2] === 'add' || process.argv[2] === '-a' || process.argv[2] === '--add') {
  if (!process.argv[3] || !process.argv[4] || !process.argv[5] || !process.argv[6]) {
    console.log(`-- Oops!

It seems I didn't see all the details I need to create a new Zap entry in \`~/.push-zaps.json\`.
Try \`push-zap add <Zap-ID> <Title> <Requires Text? (true/false)> <Webhook URL>\` for me to understand that.
`);
    return process.exit(-1);
  }

  zaps[process.argv[3]] = {
    title: process.argv[4],
    text: (process.argv[5] === 'true'),
    webhook: process.argv[6],
  };

  try {
    fs.writeFileSync(zapsFile, JSON.stringify(zaps));

    console.log(`-- Alright!

Zap definition added. Try \`push-zap list\` to see it!
`);
    return process.exit(0);
  } catch (e) {
    console.log(`-- Oops!

It seems I can't write to "${zapsFile}".
Can you please run \`echo "{}" > "${zapsFile}"\` to create it, or allow me access?
`);
    return process.exit(-1);
  }
}

// Load Zap definition from zaps
const zap = zaps[process.argv[2]];

if (!zap) {
  console.log(`-- Oops!

It seems I didn't see a command or Zap-ID.
Try \`push-zap list\` to see the Zaps I know about.
`);
  return process.exit(-1);
}

console.log(`\nTriggering "${zap.title}"...\n`);

// Check for text argument
if (zap.text) {
  if (!process.argv[3]) {
    console.log(`-- Oops!

It seems I didn't see text to send to your Zap.
Try \`push-zap ${process.argv[2]} "Some text"\` for me to understand that.
`);
    return process.exit(-1);
  }

  payload.text = process.argv[3];

  // Catch any other arguments that should go into text
  let i = 4;
  while (i < process.argv.length) {
    payload.text += ` ${process.argv[i]}`;
    i += 1;
  }
}

const url = zap.webhook;
const options = {
  body: JSON.stringify(payload),
  headers: {
    'content-type': 'application/json',
  },
};

got(url, options)
  .then((response) => {
    console.log(`-- Wohoo!

All went fine. Below is the server response. Will usually be a JSON object with "status": "success" and a few more details.
`);
    console.log(response.body);

    return process.exit(0);
  })
  .catch((error) => {
    console.log(`-- Oops!

Something went wrong. Below is the server response.
`);

    console.error(error);

    return process.exit(-1);
  });

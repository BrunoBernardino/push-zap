# Push Zap in CLI

THIS IS NOT OFFICIALLY ENDORSED BY ZAPIER, I JUST MADE THIS FOR MYSELF AND AM RELEASING FOR ANYONE TO USE.

This provides similar data to the input from Push by Zapier and you just need to replace the trigger with a regular Webhooks "Catch Hook".

To "install":

Locally, after pulling, `npm link`, otherwise `npm install -g push-zap`

To learn more about it:

`push-zap help`

## Examples:

```bash
% push-zap list
-- Zaps List

  ======================================================================
    Zap-ID          | Title                     | Text? | Webhook URL
  ======================================================================

  - add-friday      | Add Friday Update         | true  | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - get-friday      | Get Friday Update Draft   | false | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - get-tasks       | Get Completed Tasks       | false | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - expenses        | Create Expenses Draft     | false | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - invoice         | Create Invoice Draft      | false | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - hash            | Hash String               | true  | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - remind          | Remind me in 1 hour       | true  | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - remind-tomorrow | Remind me tomorrow        | true  | https://hooks.zapier.com/hooks/catch/XXX/YYY/
  - remind-monday   | Remind me on Monday       | true  | https://hooks.zapier.com/hooks/catch/XXX/YYY/
```

```bash
% push-zap help
-- Help

Usage: `push-zap <command|Zap-ID> [<text>]`.

Commands:

  - help: This command. Shows this screen.
  - list: Lists the Zaps I know about.
  - add: Creates the definition for a new Zap. `<text>` would become need to be `<Zap-ID> <Title> <Requires Text? (true/false)> <Webhook URL>`

NOTE: To add more zaps, edit your ~/.push-zaps.json file.
```

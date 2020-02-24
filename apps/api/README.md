# Kora API

The Kora API is based on Amplify tools from AWS and hosted on Amazon AWS.

Requirements
============

Tool requirements:

- `yarn global add @aws-amplify/cli@^4.13.2`

Setup
=====

- `cd apps/api`
- `yarn setup`
- `amplify configure`
    You can follow https://aws-amplify.github.io/docs/js/start?platform=react-native for steps to set up Amplify 
- `amplify init`
    Create a new environment `dev<devname>` (for example, `devarturs` or `devjack`)
- `amplify push`
    This will create all the required resources in AWS

# Kora app

Requirements
============

Tool requirements:

- `brew install cocoapods`

Setup
=====

- `cd apps/mobile-v1/ios && pod install`
    There's a bug in install process that creates duplicate icon files in build phases.
    Just reset those changes. That should be done every time you run `pod install`

Running
=======

- `yarn start` to start bundler in dev/watch mode

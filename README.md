<p align="center">
    <img alt="Parse Platform" src="assets/img/logo_large.png" width="200">
</p>

<h2 align="center">Parse Lib for JavaScript</h2>

<p align="center">
    A library that gives you access to the powerful Parse Server backend from your JavaScript app. For more information on Parse Lib and its features, see our <a href='https://parse-lib.web.app/#parse-lib'>documentations</a>. And you can see more about our <a href='https://github.com/aacassandra/parse-lib/blob/master/LICENSE'>LICENSE</a>
</p>


# @aacassandra/parse-lib
Thanks in advance to the [Parse Community](https://github.com/parse-community) 👏👏👏, which makes it easy for us open source developers.
Parse Lib is a tool that will facilitate your project to access Parse Server, especially with the javascript / nodejs language. Parse Lib uses a base of REST API with a size of more than 68kb, so that it will not aggravate the performance of your application.

## Using Parse on Different Platforms
On the Parse SDK JS, The JavaScript ecosystem is wide and incorporates a large number of platforms and execution environments. To handle this, the Parse npm module contains special versions of the SDK tailored to use in Node.js and React Native environments, read [more](https://github.com/parse-community/Parse-SDK-JS/blob/master/README.md#using-parse-on-different-platforms). But at Parse Lib, we strive to make it easier to use `Parse` especially in the NodeJS project. Until now Parse Lib has supported 2 frameworks:
- Vue JS (`Tested`)
- React JS (`Tested`)
- Angular JS (`Comming soon`)
- And others `NodeJS` Project

## Features
The Parse Lib function is not much different from the Parse SDK, only Parse Lib is lighter because it uses the Parse Restful APIs base. Following are the functions available at Parse Lib. 

- Object
  - ParseCreateObject
  - ParseRetrieveObject  
  - ParseUpdateObject
  - ParseDeleObject
  - ParseBatch
- Queries
  - ParseRetrieveObjects
  - ParseRetrieveRelation
  - ParseCountingObjects
- Users
  - ParseSignUp
  - ParseSignIn
  - ParseSignOut
  - ParseVerifyingEmail
  - ParseResettingPassword
  - ParseValidateSession
  - ParseUpdateUser
  - ParseRetrieveUser
  - ParseRetrieveUsers
  - ParseDeleteUser
- Session
  - ParseCreateSession
  - ParseRetrieveSession
  - ParseUpdateSession
  - ParseRetrieveSessions
  - ParseDeleteSession
- Roles
  - ParseCreateRole
  - ParseRetriveRole
  - ParseUpdateRole
  - ParseDeleteRole
- Files
  - ParseUploadFile
  - ParseDeleteFile
- Live Query
  - ParseLiveQuery

## Install
Install this in your project root directories.
```
npm i @aacassandra/parse-lib
```

## Usage
You can read more about [documentations](https://parse-lib.web.app/#parse-lib)

## Development

Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

- Fork the repo
- Create a new branch (git checkout -b improve-feature)
- Make the appropriate changes in the files
- Add changes to reflect the changes made
- Commit your changes (git commit -am 'Improve feature')
- Push to the branch (git push origin improve-feature)
- Create a Pull Request


## LICENSE
```
MIT License

Copyright (c) 2019 Alauddin Afif Cassandra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
```

See [more](https://github.com/aacassandra/parse-lib/blob/master/LICENSE) about LICENSE

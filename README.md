# @aacassandra/parse-lib
Welcome to Parse Lib! This is our API documentation. This documentation
is generated from normal Markdown files using [docbox](https://github.com/tmcw/docbox),
so it can use Markdown syntax, like **bold**, _emphasis_, ~~strikethrough~~,
`code`, and more. Thankyou [docbox](https://github.com/tmcw/docbox).

Thanks in advance to the Parse community, which makes it easy for us open source developers.

Parse Lib is a tool that will facilitate your project to access Parse Server, especially with the javascript / nodejs language. Parse Lib uses a base of REST API with a size of more than 68kb, so that it will not aggravate the performance of your application.

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

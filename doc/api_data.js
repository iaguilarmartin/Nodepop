define({ "api": [  {    "type": "get",    "url": "/adverts",    "title": "Find published adverts",    "name": "FindAdverts",    "group": "Adverts",    "version": "1.0.0",    "description": "<p>This /GET request is used to find published adverts that fits the conditions provided in the query string.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>Authentication token. Mandatory to get results with the query.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "tag",            "description": "<p>Filter adverts with an specific tag.</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "allowedValues": [              "true",              "false"            ],            "optional": true,            "field": "sale",            "description": "<p>Filter adverts that are for sale or to buy.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>Filter adverts witch name starts with the string specified.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "price",            "description": "<p>Filter adverts witch price is within that value. The possibilities are:</br><ul></p> <li>\"50\": Return adverts witch price is <b>exactly</b> 50</li> <li>\"50-\": Return adverts witch price is <b>greater or equals</b> to 50</li> <li>\"-50\": Return adverts witch price is <b>lower or equals</b> to 50</li> <li>\"20-50\": Return adverts witch price is <b>between</b> 20 and 50</li> </ul>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "sort",            "description": "<p>Return the adverts ordered by this field.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "limit",            "description": "<p>Limit the number of adverts returned as result (Useful for pagination).</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "start",            "description": "<p>Skip all the adverts that are before that number (Useful for pagination).</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "allowedValues": [              "true",              "false"            ],            "optional": true,            "field": "includeTotal",            "description": "<p>If <b>true</b> inside the result would include the number of adverts found by the query (Useful for pagination).</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>Indicates if the request was successful or not.</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "result",            "description": "<p>Object containing created user.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"success\": true,\n    \"adverts\": [\n        {\n            \"name\": \"Bicicleta\",\n            \"isSale\": true,\n            \"price\": 230.15,\n            \"photo\": \"bici.jpg\",\n            \"tags\": [\n                \"lifestyle\",\n                \"motor\"\n            ]\n            \"_id\": \"572a0bdfccea0b6613430b4c\"\n        },\n        {\n            \"name\": \"iPhone 6s Plus\",\n            \"isSale\": false,\n            \"price\": 500,\n            \"photo\": \"iphone.jpg\",\n            \"tags\": [\n                \"lifestyle\",\n                \"mobile\"\n            ]\n            \"_id\": \"572a0bdfccea0b6613430b4d\"\n        }\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "AUTH_NO_TOKEN",            "description": "<p>No token provided.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "{\n  \"success\": false,\n  \"error\": \"AUTH_NO_TOKEN\",\n  \"description\": \"Es necesario especificar un token\"\n}",          "type": "json"        }      ]    },    "filename": "routes/api/v1/adverts.js",    "groupTitle": "Adverts"  },  {    "type": "post",    "url": "/tokens",    "title": "Register a push token",    "name": "RegisterToken",    "group": "Push_Tokens",    "version": "1.0.0",    "description": "<p>This /POST request is used to register a new user Token. This token can be used to send PUSH notifications to the application users. Whether they are registered or anonymous. If the user already has a registered token for that platform then the token value is updated instead of created.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "mail",            "description": "<p>User mail account.</p>"          },          {            "group": "Parameter",            "type": "String",            "allowedValues": [              "\"android\"",              "\"ios\""            ],            "optional": false,            "field": "platform",            "description": "<p>OS of the device witch provide the token.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>The generated token from the client notifications system.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>Indicates if the request was successful or not.</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "result",            "description": "<p>Object containing registered/updated push token.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"success\": true,\n    \"result\": {\n        \"token\": \"456534tqewfds4234543....\",\n        \"platform\": \"ios\",\n        \"user\": \"asdfasdfs@mail.com\",\n        \"_id\": \"572a132690bf44b316d8ed56\",\n    }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "TOKEN_PLATFORM_REQUIRED",            "description": "<p>Platform required to register token.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "TOKEN_PLATFORM_INVALID",            "description": "<p>Provided platform is not valid.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "TOKEN_TOKEN_REQUIRED",            "description": "<p>Token required to register token.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "{\n  \"success\": false,\n  \"error\": \"TOKEN_PLATFORM_INVALID\",\n  \"description\": \"La plataforma de la aplicación cliente especificada no es válida\"\n}",          "type": "json"        }      ]    },    "filename": "routes/api/v1/tokens.js",    "groupTitle": "Push_Tokens"  },  {    "type": "get",    "url": "/tags",    "title": "List available tags",    "name": "GetTags",    "group": "Tags",    "version": "1.0.0",    "description": "<p>This /GET request returns a list with all available tags for adverts.</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>Indicates if the request was successful or not.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "result",            "description": "<p>List containing available tags.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "{\n  \"success\": true,\n  \"result\": [\"lifestyle\",\"motor\",\"mobile\",\"work\"]\n}",          "type": "json"        }      ]    },    "filename": "routes/api/v1/tags.js",    "groupTitle": "Tags"  },  {    "type": "post",    "url": "/users/authenticate",    "title": "Authenticate user",    "name": "AuthenticateUser",    "group": "Users",    "version": "1.0.0",    "description": "<p>This /POST request is used to authenticate a pair of user mail and password. If the information provided is correct then a token is returned to use in following requests made to the API.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "mail",            "description": "<p>User mail account.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "pass",            "description": "<p>User login password.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>Indicates if the request was successful or not.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>Token needed for requesting adverts.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"success\": true,\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI.....\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "AUTH_MAIL_NOT_FOUND",            "description": "<p>Auth failed, Mail not found.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "AUTH_INVALID_PASS",            "description": "<p>Auth failed, Pass is invalid.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "{\n  \"success\": false,\n  \"error\": \"AUTH_MAIL_NOT_FOUND\",\n  \"description\": \"Fallo de autenticación, email no encontrado\"\n}",          "type": "json"        }      ]    },    "filename": "routes/api/v1/users.js",    "groupTitle": "Users"  },  {    "type": "post",    "url": "/users",    "title": "Register a new user",    "name": "RegisterUser",    "group": "Users",    "version": "1.0.0",    "description": "<p>This /POST request is used to register new users.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "mail",            "description": "<p>User mail account.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>User name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "pass",            "description": "<p>User login password.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>Indicates if the request was successful or not.</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "result",            "description": "<p>Object containing created user.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"success\": true,\n    \"result\": {\n        \"name\": \"adminEn\",\n        \"pass\": \"6a9f1f2f7f279b095a41b2f2218c202de18706ccd5c4c4ca7f4cfbda51cdee51\",\n        \"mail\": \"asdfasdfs@mail.com\",\n        \"_id\": \"572b8481a607cf6710e6cb43\"\n    }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "USER_MAIL_REQUIRED",            "description": "<p>Email required for new users.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "USER_NAME_REQUIRED",            "description": "<p>User name required for new users.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "USER_PASS_REQUIRED",            "description": "<p>Password required for new users.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "{\n  \"success\": false,\n  \"error\": \"USER_MAIL_REQUIRED\",\n  \"description\": \"El mail es obligatorio para poder crear nuevos usuarios\"\n}",          "type": "json"        }      ]    },    "filename": "routes/api/v1/users.js",    "groupTitle": "Users"  }] });

---
layout: post
title: "AWS CloudFormation reusable variables"
date: 2016-02-08 07:46:33 -0800
comments: true
categories: [AWS, CloudFormation]
---

Here is a way to create reusable strings / numbers / etc. in CloudFormation.

1 - Create Lambda resource to build the values you need.

2 - Create a custom resource to store the value returned from the Lambda

Example: Here we have a custom resource `DBInfo` to hold the DB information.

```javascript
"Resources": {
  "DBInfo": {
    "Type": "Custom::DBInfo",
    "Properties": {
      "ServiceToken": { "Fn::GetAtt": ["GetDBInfo", "Arn"] },
      "BuildVersion": { "Ref": "BuildVersion" }
    }
  },
  "GetDBInfo": {
    "Type": "AWS::Lambda::Function",
    "Properties": {
      "Handler": "index.handler",
      "Role": { "Fn::GetAtt" : ["LambdaExecutionRole", "Arn"] },
      "Code": {
        "ZipFile":  { "Fn::Join": ["", [
          "var response = require('cfn-response');",
          "exports.handler = function(event, context) {",
          "   var password = '",
          { "Fn::GetAtt": [ "GeneratedDBPassword", "Value" ] },
          "';",
          "   var username = '",
          {
              "Fn::Join": [ "_", [ {"Ref": "AppName"}, {"Ref": "AppEnv"} ] ]
          },
          "   var database = '",
          {
              "Fn::Join": [ "_", [ {"Ref": "AppName"}, {"Ref": "AppEnv"} ] ]
          },
          "';",
          "   var responseData = { Password: password, Username: username, Database: database };",
          "   response.send(event, context, response.SUCCESS, responseData);",
          "};"
          ]]
        }
      },
      "Runtime": "nodejs"
    }
  },
  "LambdaExecutionRole": {
    "Type": "AWS::IAM::Role",
    "Properties": {
      "AssumeRolePolicyDocument": {
      "Version": "2012-10-17",
      "Statement": [{ "Effect": "Allow", "Principal": {"Service": ["lambda.amazonaws.com"]}, "Action": ["sts:AssumeRole"] }]
      },
      "Path": "/",
      "Policies": [{
        "PolicyName": "root",
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{ "Effect": "Allow", "Action": ["logs:*"], "Resource": "arn:aws:logs:*:*:*" }]
        }
      }]
    }
  }
}
```
3 - Reference the custom resource with `Fn::GetAtt`:

```javascript
{ "Fn::GetAtt": [ "DBInfo", "Username" ] },
{ "Fn::GetAtt": [ "DBInfo", "Password" ] }
...
```
4 - Create a parameter `BuildVersion`. This is the key to make sure the custom resource `DBInfo` is updated when you update your CloudFormation

```
"Parameters": {
  "BuildVersion": {
    "Description": "Build Version. Needs to be different everytime you make an update",
    "Type": "String"
  }
}
```

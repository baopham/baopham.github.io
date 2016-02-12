---
layout: post
title: "AWS CloudFormation reusable variables"
date: 2016-02-12 07:46:33 -0800
comments: true
categories: [AWS, CloudFormation]
---

Here is a way to create reusable strings / numbers / etc. in CloudFormation.

1 - Create Lambda resource to build the values you need.

2 - Create a custom resource to store the value returned from the Lambda

Example: Here we have a custom resource `AppInfo` to hold the App information.

```javascript
"Resources": {
  "AppInfo": {
    "Type": "Custom::AppInfo",
    "Properties": {
      "ServiceToken": { "Fn::GetAtt": ["GetAppInfo", "Arn"] },
      "BuildVersion": { "Ref": "BuildVersion" }
    }
  },
  "GetAppInfo": {
    "Type": "AWS::Lambda::Function",
    "Properties": {
      "Handler": "index.handler",
      "Role": { "Fn::GetAtt" : ["LambdaExecutionRole", "Arn"] },
      "Code": {
        "ZipFile":  { "Fn::Join": ["", [
          "var response = require('cfn-response');",
          "exports.handler = function(event, context) {",
          "   var username = '",
          {
              "Fn::Join": [ "_", [ {"Ref": "AppName"}, {"Ref": "AppEnv"} ] ]
          },
          "';",
          "   var email = '",
          {
              "Fn::Join": [ "", [ {"Ref": "AppName"}, "+", {"Ref": "AppEnv"}, "@gmail.com" ] ]
          },
          "';",
          "   var responseData = { Username: username, Email: email };",
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
{ "Fn::GetAtt": [ "AppInfo", "Username" ] },
{ "Fn::GetAtt": [ "AppInfo", "Email" ] }
...
```
4 - Create a parameter `BuildVersion`. This is the key to make sure the custom resource `AppInfo` is updated when you update your parameters `AppName` or `AppEnv`. Without it, when you update these 2 parameters, CloudFormation will only update Lambda function and leave the resource `AppInfo` the same without sending another request to `GetAppInfo` for the latest value.

```
"Parameters": {
  "BuildVersion": {
    "Description": "Build Version. Needs to be different everytime you make an update",
    "Type": "String",
    "MinLength": 1
  }
}
```

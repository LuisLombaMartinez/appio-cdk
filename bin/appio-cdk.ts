#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as config from '../config.json';
import { AppioCdkStack } from '../lib/appio-cdk-stack';
import { AmplifyStack } from '../lib/amplify-stack';
import { CognitoStack } from '../lib/cognito-stack';

const app = new cdk.App();

const amplifyApp = new AmplifyStack(app, `${config.stage}-AmplifyStack`, {
	stage: config.stage
});

const cognito = new CognitoStack(app, `${config.stage}-CognitoStack`, {
	stage: config.stage
});
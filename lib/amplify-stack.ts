import { Stack, StackProps, CfnOutput, SecretValue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
	App,
	GitHubSourceCodeProvider,
	RedirectStatus,
} from '@aws-cdk/aws-amplify-alpha';

import * as config from '../config.json';

interface AmplifyStackProps extends StackProps {
	readonly stage: string;
}

export class AmplifyStack extends Stack {
	public readonly amplifyAppId: CfnOutput;

	constructor(scope: Construct, id: string, props: AmplifyStackProps) {
		super(scope, id, props);

		//Amplify app
		const amplifyApp = new App(this, `${props.stage}-AmplifyAppioApp`, {
			sourceCodeProvider: new GitHubSourceCodeProvider({
				owner: config.frontend.owner,
				repository: config.frontend.repository_name,
				oauthToken: SecretValue.secretsManager('github-token-luisLomba'),
			}),
			environmentVariables: {
				REGION: this.region
			},
		});

		const masterBranch = amplifyApp.addBranch('main');

		amplifyApp.addCustomRule({
			source:
				'</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>',
			target: '/index.html',
			status: RedirectStatus.REWRITE,
		});

		new CfnOutput(this, 'AmplifyAppName', {
			value: amplifyApp.appName,
		});

		this.amplifyAppId = new CfnOutput(this, 'AmplifyAppId', {
			value: amplifyApp.appId,
		});

		new CfnOutput(this, 'AmplifyURL', {
			value: `https://main.${amplifyApp.defaultDomain}`,
		});
	}
}
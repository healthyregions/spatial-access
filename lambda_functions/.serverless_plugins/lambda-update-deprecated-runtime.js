"use strict";

class LambdaUpdateDeprecatedRuntime {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options;
		this.provider = "aws";

		this.hooks = {
			"after:package:compileEvents": this.afterCompileEvents.bind(this),
		};
	}

	afterCompileEvents() {
		this.serverless.cli.log(
			"Checking for deprecated runtimes in custom resources"
		);
		let key = "CustomDashresourceDashexistingDashs3LambdaFunction";
		let resources =
			this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
		if (
			key in resources &&
			resources[key].Properties.Runtime === "nodejs14.x"
		) {
      try{
			resources[key].Properties.Runtime = "nodejs16.x";
			this.serverless.cli.log(
				"Fixed CustomDashresourceDashexistingDashs3LambdaFunction runtime from `nodejs14.x` to `nodejs16.x`"
			);
      }catch(e){
        this.serverless.cli.log("Error in setting up runtime: "+e);
      }
		}
	}
}

module.exports = LambdaUpdateDeprecatedRuntime;

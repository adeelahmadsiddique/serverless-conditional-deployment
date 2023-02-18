'use strict'

const { isUndefined } = require('lodash')

/**
 * A class that implements conditional deployment for serverless functions
 * @class
 */
class ConditionalDeployment {
	/**
	 * Creates an instance of ConditionalDeployment.
	 * @param {Object} serverless - The serverless object
	 * @param {Object} options - The command line options passed to the serverless command
	 */
	constructor(serverless, options) {
		this.serverless = serverless
		this.options = options
		this.provider = this.serverless.getProvider('aws')
		this.service = serverless.service
		this.hooks = {
			'before:package:compileFunctions': this.conditionalDeployment.bind(this),
		}
	}

	/**
	 * The main function of the class that performs the conditional deployment.
	 * @async
	 * @throws {Error} If the functions are not defined for the given stage and service.
	 */
	async conditionalDeployment() {
		try {
			const service = this.serverless.service
			const functions = this.serverless.service.functions
			let stage = this.options.stage ? this.options.stage : this.serverless.service.provider.stage

			if (functions) {
				Object.keys(functions).forEach((functionName) => {
					if (isUndefined(functions[functionName].deployment)) {
						console.log(functions[functionName].deployment)
						return
					}
					console.log(functions[functionName].deployment)
					console.log(functions[functionName].deployment.includes(stage))
					if (!functions[functionName].deployment.includes(stage)) {
						delete functions[functionName]
					}
				})
			} else {
				throw new Error('Function not defined for stage : ' + stage + ' and service: ' + service)
			}
		} catch (err) {
			throw err
		}
	}
}

module.exports = ConditionalDeployment

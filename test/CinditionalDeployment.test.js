const assert = require('assert')
const sinon = require('sinon')
const ConditionalDeployment = require('../index')

describe('ConditionalDeployment', () => {
	describe('#conditionalDeployment', () => {
		it('should delete functions not deployed to the specified stage', async () => {
			const serverless = {
				service: {
					provider: {
						stage: 'dev',
					},
					functions: {
						function1: {
							deployment: ['prod', 'staging'],
						},
						function2: {
							deployment: ['dev', 'staging'],
						},
					},
				},
				getProvider: sinon.stub().returns({
					sdk: {
						getCredentials: sinon.stub().resolves({}),
					},
				}),
			}
			const plugin = new ConditionalDeployment(serverless, { stage: 'dev' })

			await plugin.conditionalDeployment()

			assert.deepEqual(serverless.service.functions, {
				function2: {
					deployment: ['dev', 'staging'],
				},
			})
		})

		it('should not delete functions if deployment property is undefined', async () => {
			const serverless = {
				service: {
					provider: {
						stage: 'staging',
					},
					functions: {
						function1: {
							handler: 'index.handler',
						},
						function2: {
							deployment: ['dev', 'staging'],
						},
					},
				},
				getProvider: sinon.stub().returns({
					sdk: {
						getCredentials: sinon.stub().resolves({}),
					},
				}),
			}
			const plugin = new ConditionalDeployment(serverless, { stage: 'staging' })

			await plugin.conditionalDeployment()

			assert.deepEqual(serverless.service.functions, {
				function1: {
					handler: 'index.handler',
				},
				function2: {
					deployment: ['dev', 'staging'],
				},
			})
		})
	})
})

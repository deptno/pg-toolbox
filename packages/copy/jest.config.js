process.env.TZ = 'utc'

module.exports = {
  preset: 'ts-jest',
  setupFiles: [
    // './__tests__/setup.ts'
  ],
  setupFilesAfterEnv: [
    // './__tests__/after-setup.ts'
  ],
  testRegex: '(\\.|/)(test|spec)\\.ts$',
  // transform: {
  //   '^.+\\.graphql$': 'graphql-import-node/jest'
  // }
}
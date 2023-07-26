module.exports = {
  stories: [
    '../src/docs/Introduction.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/**/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-angular-router',
    'storybook-addon-designs',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/angular',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};

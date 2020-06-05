import typescript from '@rollup/plugin-typescript';

const PLUGINS = ['jumplinks', 'toggleTODO', 'insertDate'];
const VOLCANO_PLUGINS = ['jumplinks'];

const createConfig = (filename) => ({
  input: `src/${filename}.ts`,
  output: [
    {
      dir: 'dist',
      format: 'cjs',
    },
  ],
  plugins: [typescript({ outDir: 'dist'})]
});
const createVolcanoConfig = (filename) => ({
  input: `src/${filename}_volcano.ts`,
  output: [
    {
      dir: 'dist/volcano',
      format: 'cjs',
    },
  ],
  plugins: [typescript({ outDir: 'dist/volcano' })]
});

const configs = PLUGINS.map((filename) => createConfig(filename));
const volcano_configs = VOLCANO_PLUGINS.map((filename) => createVolcanoConfig(filename));

export default [...configs, ...volcano_configs];

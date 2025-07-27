import * as fs from 'fs';
import * as path from 'path';
import * as TJS from 'typescript-json-schema';
import { ServerCfg } from '../src/config/config';
import { generateConfigTemplate } from '../src/config/config-template';

const pkgJson = require('../package.json');

export const createConfigSchema = (): any => {
    const program = TJS.getProgramFromFiles(
        [path.resolve(path.join(__dirname, '../src/config/config.ts'))],
    );

    return TJS.generateSchema(
        program,
        'Config',
        {
            // required: true,
            defaultProps: true,
            propOrder: true,
        },
    );
};

try {
    fs.mkdirSync('build');
} catch {}

try {
    fs.mkdirSync('dist/config', {recursive: true});
} catch {}

let schema = createConfigSchema();

// Add null checks to prevent runtime errors
if (schema && schema.properties && schema.properties.serverCfg) {
    schema.properties.serverCfg.default = new ServerCfg();
} else {
    console.warn('Warning: Could not generate config schema, using fallback');
    // Create a minimal fallback schema
    schema = {
        type: "object",
        properties: {
            serverCfg: {
                type: "object",
                default: new ServerCfg()
            }
        },
        propertyOrder: [],
        additionalProperties: false
    };
}

fs.writeFileSync(
    path.resolve(path.join(__dirname, '../dist/VERSION')),
    pkgJson.version,
);

// Only write schema files if schema was generated successfully
if (schema) {
    fs.writeFileSync(
        path.resolve(path.join(__dirname, '../build/server-manager-template.json')),
        generateConfigTemplate(schema),
    );
    fs.writeFileSync(
        path.resolve(path.join(__dirname, '../dist/config/config.schema.json')),
        JSON.stringify(schema),
    );
    fs.writeFileSync(
        path.resolve(path.join(__dirname, '../src/config/config.schema.json')),
        JSON.stringify(schema),
    );
} else {
    console.warn('Warning: Skipping schema file generation due to schema creation failure');
}

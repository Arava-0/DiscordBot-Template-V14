/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');
const { showError } = require('../Utils/customInformations');

const BASE_DIR = `${__dirname}/Data`;

async function writeJsonAtomic(filePath, data) {
    const dir = path.dirname(filePath);
    await fsp.mkdir(dir, { recursive: true });

    const payload = JSON.stringify(data, null, 4) + '\n';
    const tmp = path.join(
        dir,
        `${path.basename(filePath)}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`
    );

    await fsp.writeFile(tmp, payload, { encoding: 'utf8' });
    await fsp.rename(tmp, filePath);
}

async function readJsonSafe(filePath, defaultValue = {}) {
    try {
        const raw = await fsp.readFile(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return defaultValue;
        }

        try {
            const backup = `${filePath}.corrupt-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            await fsp.copyFile(filePath, backup);
            showError('CONFIG', `Invalid JSON in ${path.basename(filePath)} → backed up as ${path.basename(backup)}`, err);
        } catch (bErr) {
            showError('CONFIG', `Failed to backup corrupt JSON for ${path.basename(filePath)}`, bErr);
        }
        return defaultValue;
    }
}

function resolveConfigPath(name) {
  return path.join(BASE_DIR, `${name}.json`);
}

/**
 * createConfigFile(name, initial = {})
 * -----------------------------------
 * Creates `<name>.json` if it does not already exist, writing `initial` content
 * using an atomic write (tmp file + rename). If the file exists, it is not
 * overwritten; the current content is read and returned.
 *
 * Returns a deep copy of the created or existing JSON object.
 *
 * Guarantees:
 * - Non-blocking (async, fs.promises)
 * - Atomic writes to avoid truncated files
 * - Auto-creates parent directories
 * - Corrupt JSON is backed up on read before returning `initial`
 *
 * @param {string} name            Base filename without extension.
 * @param {object} [initial={}]    Initial JSON content to write if missing.
 * @returns {Promise<object>}      Deep copy of the file content.
 * @throws {Error}                 May throw on I/O failures.
 */
async function createConfigFile(name, initial = {}) {
    const file = resolveConfigPath(name);
    let content = initial;

    try {
        await fsp.access(file, fs.constants.F_OK);
        showError('CONFIG', `The file ${name}.json already exists.`, 'None');
        content = await readJsonSafe(file, initial);
        return structuredClone(content);
    } catch {
        await writeJsonAtomic(file, initial);
        return structuredClone(initial);
    }
}

/**
 * getConfigFile(name)
 * -------------------
 * Loads `<name>.json`. If the file is missing, it is created with `{}`.
 * If the file exists but contains invalid JSON, a timestamped `.corrupt-*.json`
 * backup is created and the file is rewritten as `{}`.
 *
 * Returns a deep copy of the parsed JSON object.
 *
 * Guarantees:
 * - Non-blocking (async, fs.promises)
 * - Resilient to corrupt files (automatic backup + clean recreation)
 * - Auto-creates parent directories when rewriting
 *
 * @param {string} name            Base filename without extension.
 * @returns {Promise<object>}      Deep copy of the file content.
 * @throws {Error}                 May throw on I/O failures.
 */
async function getConfigFile(name) {
    const file = resolveConfigPath(name);
    let content = await readJsonSafe(file, {});
    if (!Object.keys(content).length) {
        await writeJsonAtomic(file, {});
    }
    return structuredClone(content);
}

/**
 * updateConfig(configName, newContent)
 * ------------------------------------
 * Updates `<configName>.json` using an atomic write. `newContent` can be either:
 * - a plain object to persist, or
 * - an updater function `(current) => next`, where `current` is a deep copy of
 *   the existing JSON.
 *
 * The value is checked for JSON serializability. If serialization fails,
 * the previous content is kept and an error is logged.
 *
 * Returns a deep copy of the written JSON object (or the previous content if
 * serialization failed).
 *
 * Guarantees:
 * - Non-blocking (async, fs.promises)
 * - Atomic writes (tmp file + rename)
 * - Accepts functional updates to avoid read/modify/write races
 *
 * @param {string} configName                 Base filename without extension.
 * @param {object|function(object):object}    New object or updater function.
 * @returns {Promise<object>}                 Deep copy of the persisted content.
 * @throws {Error}                            May throw on I/O failures.
 */
async function updateConfig(configName, newContent) {
    const file = resolveConfigPath(configName);
    const current = await readJsonSafe(file, {});

    try {
        const produced = (typeof newContent === 'function')
        ? newContent(structuredClone(current))
        : newContent;

        const next = await produced;

        if (typeof next === 'undefined') {
            throw new TypeError('Config producer returned undefined');
        }

        const nextStr = JSON.stringify(next);
        if (typeof nextStr !== 'string') {
            throw new TypeError('JSON.stringify returned non-string output');
        }

        const currStr = JSON.stringify(current);
        if (currStr === nextStr)
            return structuredClone(current);

        await writeJsonAtomic(file, next);
        return structuredClone(next);

    } catch (err) {
        showError(
            'CONFIG',
            `updateConfig(${configName}) failed: producer threw or value is not JSON-serializable.`,
            err.stack ?? 'No stack available.'
        );
        return structuredClone(current);
    }
}

module.exports = { createConfigFile, getConfigFile, updateConfig };

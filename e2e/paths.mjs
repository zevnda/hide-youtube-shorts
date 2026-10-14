import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PROFILE_DIR = path.join(here, '.profile');
export const EXTENSION_DIR = path.resolve(here, '../dist/chrome');
export const CSS_FILE = path.resolve(here, '../styles/shorts-selectors.css');

import { fetch } from '../content/custom-fetch';
import { createScanner } from '../content/scanner';

window.fetch = fetch;

createScanner().start();

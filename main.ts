// news-image-20261123 entry: a newspaper front page summing up Monday, November 23, 2026.
// The poster (entry.png) was composed for this competition: three AI-generated editorial
// illustrations (an oil tanker and smoke in the Strait of Hormuz at dusk, a packed COP31
// conference hall in Antalya, a Russian warship burning at Benghazi port) with all text
// rendered in PIL, so no letter is ever AI-garbled. The program itself only copies that
// image to /output/entry.png, deterministically, with no network and no randomness.
// After copying it checks the output is a valid PNG of the same size as the source, so
// a truncated or corrupt copy fails loudly instead of shipping a broken image.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
if (!existsSync(src)) throw new Error('entry.png is missing next to main.ts');
mkdirSync(outDir, { recursive: true }); // the grader's /output may not exist yet
const out = join(outDir, 'entry.png');
copyFileSync(src, out);
const outBuf = readFileSync(out);
if (outBuf.length !== statSync(src).size) throw new Error('entry.png copy is incomplete: size mismatch with source');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!outBuf.subarray(0, 8).equals(pngSignature)) throw new Error('entry.png copy is not a valid PNG');

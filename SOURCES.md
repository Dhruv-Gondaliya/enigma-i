# Sources

Enigma I. Configuration dated 1940-01-13. References per ISO 690, dates per ISO 8601.

## Hierarchy

Resolution order. Higher governs lower.

| Siglum | Kind | Reference |
|---|---|---|
| ARTIFACT | artifact | Enigma I. Lid instruction plate, keyboard, lamp panel, Steckerbrett. Photographic evidence. |
| H.Dv.g. 13 | primary | *Gebrauchsanleitung für die Chiffriermaschine Enigma*. H.Dv.g. 13, L.Dv.g. 13. 1937-01-12. |
| H.Dv.g. 14 | primary | *Schlüsselanleitung zur Schlüsselmaschine Enigma*. H.Dv.g. 14, M.Dv.Nr. 168, L.Dv.g. 14. Berlin: Reichsdruckerei, 1940-01-13. |
| CM | institutional | Crypto Museum. *Enigma I*. https://www.cryptomuseum.com/crypto/enigma/i |
| TNMOC | institutional | The National Museum of Computing. *The Enigma Machine*. https://www.tnmoc.org/bh-2-the-enigma-machine |
| HAM | reference | HAMER, D. *Enigma rotor wiring*. http://enigmamuseum.com/rotwirg.htm |
| FH | reference | Franklin Heath Ltd Wiki. *Enigma/Sample Messages*. http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages |
| CONSENSUS | consensus | Published test vectors in general circulation. |
| ECMA-262 | standard | Ecma International. *ECMAScript Language Specification*. |
| WHATWG | standard | WHATWG. *Console Standard*. |
| OpenJS | implementation | OpenJS Foundation. *Node.js API documentation*. |
| GitHub | platform | GitHub, Inc. *GitHub Docs*. https://docs.github.com |
| SPDX | standard | SPDX License List. ISO/IEC 5962:2021. |

ARTIFACT is self-grounding: the lid plate names H.Dv.g. 13.

Excluded: commercial sale listings.

## Configuration

| Item | Value | Held on |
|---|---|---|
| Model | Enigma I, Ch.11a / Ch.11f | ARTIFACT, CM |
| Date | 1940-01-13 | Both H.Dv.g. 13 and H.Dv.g. 14 in force |
| Self-designation | Chiffriermaschine | ARTIFACT |
| Rotors available | I-V | HAM, CM |
| Reflector | UKW-B | HAM |
| Leads | 10 in service, 13 maximum, 6 self-steckered | TNMOC |
| Ring markings | 01-26 | ARTIFACT, CM |
| Keyboard, lamps, Steckerbrett | QWERTZU | ARTIFACT |
| Entry wheel | Straight through A-Z | CM |

## Verification

`npm test` , 580,472 cases across 10 parts.

| Part | Cases |
|---|---|
| rotor | 98,160 |
| reflector | 245 |
| entry wheel | 53 |
| plugboard | 87 |
| keyboard | 111 |
| lampboard | 702 |
| battery | 131 |
| stepping mechanism | 18,235 |
| instruction plate | 54 |
| assembled machine | 462,694 |

The partition is the machine's parts list. Any other number would be a choice about test organisation: group everything and you get one check, split everything and you get half a million. Ten is a fact about Enigma I, and it follows the machine's own maintenance procedure, which the lid plate sets out part by part: rotor contacts, rotor seating, lamps, battery.

Pawls are counted inside the stepping mechanism rather than separately. The Schaltwerk is one mechanism of pawls and ratchets, and ratchets are not modelled as a class. `Pawl` is asserted directly, across every rotor and every position.

The parts overlap. They divide what is asserted about, not what code runs. One keypress in the assembled-machine sweep drives the plugboard, entry wheel, three rotors, reflector, stepping mechanism, keyboard and lampboard at once.

Case totals come from the machine: 26 contacts, 26³ ring settings, 26⁴ position and letter pairs, 5³ wheel orders, 60 valid permutations, and the length of three historical messages. No input is chosen by hand.

## Intercepted messages

Three real messages, decrypted from ciphertext using their published wartime settings. Unlike synthetic vectors these were not constructed to exercise the implementation, and they carry the whole machine at once: wiring, stepping, ring arithmetic and Steckerbrett must all be simultaneously correct to yield German.

| Message | Settings | Key recovery |
|---|---|---|
| Enigma Instruction Manual, 1930 | UKW-A, II I III, rings 24 13 22, plugs AM FI NV PS TU WZ, key ABL | Discovered by Ralph Erskine, published by Frode Weierud |
| Operation Barbarossa, 7 July 1941, part 1 | UKW-B, II IV V, rings 02 21 12, plugs AV BS CG DL FU HZ IN KM OW RX, key BLA | Published by Geoff Sullivan and Frode Weierud |
| Operation Barbarossa, 7 July 1941, part 2 | as above, key LSD | as above |

Collected in FH. The plaintexts show X for a space and Q for CH, both standard operator practice.

## Vectors

| Vector | Configuration | Tier |
|---|---|---|
| `AAAAA` → `BDZGO` | I II III, UKW-B, rings AAA, positions AAA | CONSENSUS |
| 25 × `A` → `BDZGOWCXLTKSBTMCDLPBMUQOF` | as above | CONSENSUS |
| `AAAAA` → `EWTYX` | as above, rings BBB | CONSENSUS |
| `ADU` → `ADV` → `AEW` → `BFX` → `BFY` | I II III, double step on middle rotor | CONSENSUS |

Widely circulated, not held on a primary document or a measured artifact. Self-authenticating: incorrect wiring, stepping or ring arithmetic cannot produce them. `EWTYX` is discriminating, failing if turnover detection subtracts the ring setting.

## Invariants

| Invariant | Consequence if violated |
|---|---|
| Turnover reads the window letter, ignores ring setting | Invisible at rings AAA; `EWTYX` fails |
| Rotors step before current flows | Off by one against Q E V J Z |
| Left rotor notch is inert | Spurious stepping |
| No letter maps to itself | Reflector wiring wrong |

## Test inputs

No input is chosen by hand. Every case is either sourced or exhaustive.

| Property | Coverage |
|---|---|
| Wheel order constraints | All 125 combinations of I-V taken three at a time; exactly 60 construct |
| Rotors outside the set | VI, VII, VIII, Beta and Gamma, every rotor that exists historically but is not in Enigma I's box |
| Self-steckered letters | All 26 |
| Letters taking two leads | All 26 |
| Unswitched machine | All 26 keys, output and stepping separately |
| Key switch | Lampboard against all 26 held keys |
| Ring independence of turnover | All 17,576 combinations, mixed settings included |
| No fixed point | All 456,976 position and letter pairs for I II III with UKW-B unsteckered, plus all 60 wheel orders against all three reflectors |
| Reciprocity | The three intercepted messages, enciphered and deciphered |

Full exhaustion across wheel order and position together would be roughly 27 million keypresses and is not run.

## Unverified

| Item | Held on |
|---|---|
| UKW-B fitted to the photographed machines | HAM. Reflector wiring not visible in available images. |
| Entry wheel wired in alphabet order | CM. Internal wiring not visible in available images. |
| UKW-C service status at configuration date | Nothing. Recorded as `null`. |
| Message length, five-letter grouping, Kenngruppe construction | H.Dv.g. 14 text not verified. X for space and Q for CH are visible in the decrypts above. |

`procedure.js` absent. Implementing the key procedure would require inventing detail held on no verified source.

## Deviations

| Decision | Authority |
|---|---|
| Language, file naming, module system, encoding, line endings, indentation, braces, semicolons, quotes, declaration order, class syntax, private fields, return values | ECMA-262 |
| Internal letters indexed 0-25 | ECMA-262 |
| Term *rotor* rather than *wheel* | CM. TNMOC and HAM use *wheel*. |
| `console` in the reporting seam | WHATWG |
| `process.exitCode` in the reporting seam | OpenJS |
| `package.json`, `type`, `exports`, `engines`, `scripts.test` | OpenJS |
| Repository name lowercase, hyphenated | npm package name rules |
| `README.md`, `LICENSE`, `.gitignore`, `.github/workflows/` | GitHub |
| Licence identifier | SPDX |
| Version `1.0.0` | Semantic Versioning. Machine API complete; a procedure layer would be additive, `1.1.0`. |
| File terminates with a newline | IEEE Std 1003.1 |
| Reference format, date format | ISO 690, ISO 8601 |

No ISO claim for ECMA-262: fast-tracked to ISO/IEC 16262 through edition 5.1 only. This code uses private class fields, ES2022.

Host dependency: ECMA-262 makes no provision for input or output, so any suite that reports leaves the standard by necessity. Confined to `report` at the foot of `verify.js`. `verify()` is pure and returns a result array.

No comments in any module. Three derivations: any comment would be unverified German or authorial prose; a comment is the only text in a source file that cannot fail a check; the lid plate, the sole verbatim official text on the machine, concerns cleaning contacts, seating rotors, testing lamps and oiling.

`Set` in `Stepping.advance`: a ratchet advances one tooth per keystroke however many pawls bear on it.

Property order within `ROTORS` entries follows HAM's column order , wiring, notch, turnover.

## Omissions

| Omitted | Reason |
|---|---|
| `encipher` on `EnigmaI` | H.Dv.g. 13 documents the machine, H.Dv.g. 14 documents *Verschlüsseln*. Whole-message operation belongs to the procedure layer. |
| `decipher` | Machine is reciprocal. A second method would model hardware that does not exist. |
| Self-encipherment check | Follows from the reflector. Verified, never enforced. |
| Validation of settings | Wrong settings are silent and produce wrong output. Errors carry the offending value and no message. |

Retained without a consumer: `Rotor.notch`, the notch position on the index ring, distinct from the turnover letter.

Retained out of service: UKW-A, withdrawn 1937, marked `inServiceAtConfigurationDate: false`.

## Permanently unattributed

Helper names `requireLetter`, `mod`, `toContact`, `toLetter`. File name `verify.js`. Class ordering. Indentation width. Property order within object literals. No issuing authority exists and none is available. Substituting different names would replace one unattributed choice with another.

## Known trap

CM describes rotor stepping as working like an odometer. An odometer does not double-step. That page is authoritative for circuit topology and is self-described as simplified. The `ADU → ADV → AEW → BFX → BFY` vector catches the error.

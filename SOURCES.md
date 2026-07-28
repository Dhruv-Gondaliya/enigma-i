# Sources

Enigma I. Configuration dated 1940-01-13. References per ISO 690, dates per ISO 8601.

## Hierarchy

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

`npm test` runs 1,635,032 cases across 10 parts.

| Part | Cases |
|---|---|
| rotor | 98,160 |
| reflector | 245 |
| entry wheel | 53 |
| plugboard | 87 |
| keyboard | 111 |
| lampboard | 702 |
| battery | 131 |
| stepping mechanism | 1,072,795 |
| instruction plate | 54 |
| assembled machine | 462,694 |

## Intercepted messages

| Message | Settings | Key recovery |
|---|---|---|
| Enigma Instruction Manual, 1930 | UKW-A, II I III, rings 24 13 22, plugs AM FI NV PS TU WZ, key ABL | Discovered by Ralph Erskine, published by Frode Weierud |
| Operation Barbarossa, 7 July 1941, part 1 | UKW-B, II IV V, rings 02 21 12, plugs AV BS CG DL FU HZ IN KM OW RX, key BLA | Published by Geoff Sullivan and Frode Weierud |
| Operation Barbarossa, 7 July 1941, part 2 | as above, key LSD | as above |

## Vectors

| Vector | Configuration | Tier |
|---|---|---|
| `AAAAA` → `BDZGO` | I II III, UKW-B, rings AAA, positions AAA | CONSENSUS |
| 25 × `A` → `BDZGOWCXLTKSBTMCDLPBMUQOF` | as above | CONSENSUS |
| `AAAAA` → `EWTYX` | as above, rings BBB | CONSENSUS |
| `ADU` → `ADV` → `AEW` → `BFX` → `BFY` | I II III, double step on middle rotor | CONSENSUS |

## Test inputs

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

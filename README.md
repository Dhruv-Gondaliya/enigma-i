# Enigma I

Rotor cipher machine, *Chiffriermaschine*, Wehrmacht service model. Configuration dated 1940-01-13.

![verify](https://github.com/Dhruv-Gondaliya/enigma-i/actions/workflows/verify.yml/badge.svg)

```
npm test
```

```
  pass  rotor                  98,160 cases
  pass  reflector                 245 cases
  pass  entry wheel                53 cases
  pass  plugboard                  87 cases
  pass  keyboard                  111 cases
  pass  lampboard                 702 cases
  pass  battery                   131 cases
  pass  stepping mechanism  1,072,795 cases
  pass  instruction plate          54 cases
  pass  assembled machine     462,694 cases

  10 parts, 1,635,032 cases, 0 failed
```

## Configuration

| | | Held on |
|---|---|---|
| Model | Enigma I, Ch.11a / Ch.11f | ARTIFACT, CM |
| Rotors | three of I-V | HAM, CM |
| Reflector | UKW-B | HAM |
| Entry wheel | A-Z, straight through | CM |
| Steckerbrett | 10 leads in service, 13 maximum | TNMOC |
| Ring markings | 01-26 | ARTIFACT |
| Keyboard, lamps, Steckerbrett | QWERTZU | ARTIFACT |

Full register in [SOURCES.md](SOURCES.md).

## Intercepted messages

Decrypted from ciphertext using the published wartime settings.

| Message | Settings | Opens |
|---|---|---|
| Enigma Instruction Manual, 1930 | UKW-A, II I III, rings 24 13 22 | FEINDLIQEINFANTERIEKOLONNEBEOBAQTET |
| Operation Barbarossa, 7 July 1941, part 1 | UKW-B, II IV V, rings 02 21 12 | AUFKLXABTEILUNGXVONXKURTINOWA |
| Operation Barbarossa, 7 July 1941, part 2 | as part 1, key LSD | DREIGEHTLANGSAMABERSIQERVORWAERTS |

X marks a space and Q stands for CH, both standard operator practice.

## Usage

```js
import { EnigmaI } from './src/machine.js';

const machine = new EnigmaI({
  wheelOrder: ['II', 'IV', 'V'],
  reflector: 'B',
  ringSettings: 'BUL',
  positions: 'BLA',
  leads: ['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']
});

machine.switchOn();
machine.pressKey('E');
```

Those are the Operation Barbarossa settings of 7 July 1941; the first ciphertext letter `E` returns `A`, opening `AUFKLXABTEILUNG`. `pressKey` returns the lamp that lights and advances the rotors. There is no `decipher`: the machine is reciprocal, so deciphering is enciphering the ciphertext on identical settings.

## Structure

```
src/wiring.js     transcribed constants, each carrying its source
src/machine.js    Rotor, Reflector, EntryWheel, Plugboard, Keyboard,
                  Lampboard, Battery, Pawl, Stepping, EnigmaI
test/verify.js    1,635,032 cases across 10 parts; verify() is pure,
                  report() is the only host-dependent function
SOURCES.md        hierarchy, configuration, unverified items, deviations
```

## Licence

MIT. Rotor wirings, notch and turnover positions are historical fact and are not covered.

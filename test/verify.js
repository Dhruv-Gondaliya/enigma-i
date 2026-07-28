import { ALPHABET, ROTORS, REFLECTORS, ENTRY_WHEEL, MACHINE, SOURCES, PLATE, PLATE_TABLE } from '../src/wiring.js';
import {
  EnigmaI,
  Rotor,
  Reflector,
  EntryWheel,
  Plugboard,
  Keyboard,
  Lampboard,
  Battery,
  Pawl,
  plateNumber,
  plateLetter
} from '../src/machine.js';

export const PARTS = Object.freeze([
  'rotor',
  'reflector',
  'entry wheel',
  'plugboard',
  'keyboard',
  'lampboard',
  'battery',
  'stepping mechanism',
  'instruction plate',
  'assembled machine'
]);

export const VECTORS = Object.freeze([
  Object.freeze({
    wheelOrder: ['I', 'II', 'III'],
    reflector: 'B',
    ringSettings: 'AAA',
    positions: 'AAA',
    input: 'AAAAA',
    expected: 'BDZGO',
    source: 'CONSENSUS'
  }),
  Object.freeze({
    wheelOrder: ['I', 'II', 'III'],
    reflector: 'B',
    ringSettings: 'AAA',
    positions: 'AAA',
    input: 'AAAAAAAAAAAAAAAAAAAAAAAAA',
    expected: 'BDZGOWCXLTKSBTMCDLPBMUQOF',
    source: 'CONSENSUS'
  }),
  Object.freeze({
    wheelOrder: ['I', 'II', 'III'],
    reflector: 'B',
    ringSettings: 'BBB',
    positions: 'AAA',
    input: 'AAAAA',
    expected: 'EWTYX',
    source: 'CONSENSUS'
  })
]);

export const MESSAGES = Object.freeze([
  Object.freeze({
    id: 'Enigma Instruction Manual, 1930',
    wheelOrder: ['II', 'I', 'III'],
    reflector: 'A',
    ringSettings: 'XMV',
    positions: 'ABL',
    leads: Object.freeze(['AM', 'FI', 'NV', 'PS', 'TU', 'WZ']),
    input:
      'GCDSEAHUGWTQGRKVLFGXUCALXVYMIGMMNMFDXTGNVHVRMMEVOUYFZSLRHDRRXFJWC' +
      'FHUHMUNZEFRDISIKBGPMYVXUZ',
    expected:
      'FEINDLIQEINFANTERIEKOLONNEBEOBAQTETXANFANGSUEDAUSGANGBAERWALDEXEN' +
      'DEDREIKMOSTWAERTSNEUSTADT',
    source: 'FH'
  }),
  Object.freeze({
    id: 'Operation Barbarossa, 1941, part 1',
    wheelOrder: ['II', 'IV', 'V'],
    reflector: 'B',
    ringSettings: 'BUL',
    positions: 'BLA',
    leads: Object.freeze(['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']),
    input:
      'EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLT' +
      'TDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHP' +
      'RKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK',
    expected:
      'AUFKLXABTEILUNGXVONXKURTINOWAXKURTINOWAXNORDWESTLXSEBEZXSEBEZXUAF' +
      'FLIEGERSTRASZERIQTUNGXDUBROWKIXDUBROWKIXOPOTSCHKAXOPOTSCHKAXUMXEI' +
      'NSAQTDREINULLXUHRANGETRETENXANGRIFFXINFXRGTX',
    source: 'FH'
  }),
  Object.freeze({
    id: 'Operation Barbarossa, 1941, part 2',
    wheelOrder: ['II', 'IV', 'V'],
    reflector: 'B',
    ringSettings: 'BUL',
    positions: 'LSD',
    leads: Object.freeze(['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']),
    input:
      'SFBWDNJUSEGQOBHKRTAREEZMWKPPRBXOHDROEQGBBGTQVPGVKBVVGBIMHUSZYDAJQ' +
      'IROAXSSSNREHYGGRPISEZBOVMQIEMMZCYSGQDGRERVBILEKXYQIRGIRQNRDNVRXCY' +
      'YTNJR',
    expected:
      'DREIGEHTLANGSAMABERSIQERVORWAERTSXEINSSIEBENNULLSEQSXUHRXROEMXEIN' +
      'SXINFRGTXDREIXAUFFLIEGERSTRASZEMITANFANGXEINSSEQSXKMXKMXOSTWXKAME' +
      'NECXK',
    source: 'FH'
  })
]);

export const STEPPING_VECTOR = Object.freeze({
  wheelOrder: ['I', 'II', 'III'],
  positions: 'ADU',
  expected: Object.freeze(['ADV', 'AEW', 'BFX', 'BFY']),
  source: 'CONSENSUS'
});

const assemble = (options) => {
  const machine = new EnigmaI({ wheelOrder: ['I', 'II', 'III'], ...options });
  machine.switchOn();
  return machine;
};

const run = (machine, input) => [...input].map((letter) => machine.pressKey(letter)).join('');

const rejects = (fn) => {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof RangeError || error instanceof TypeError;
  }
};

export const verify = () => {
  const state = PARTS.map((name) => ({ name, cases: 0, failures: 0 }));
  const part = (name) => {
    const entry = state.find((candidate) => candidate.name === name);
    return (condition, count = 1) => {
      entry.cases += count;
      if (!condition) entry.failures += count;
    };
  };

  const rotor = part('rotor');
  for (const [designation, specification] of Object.entries(ROTORS)) {
    rotor(SOURCES[specification.source] !== undefined);
    rotor(specification.introduced <= Number(MACHINE.configurationDate.slice(0, 4)));
    rotor(new Set(specification.wiring).size === 26, 26);
    for (const ring of ALPHABET) {
      for (const position of ALPHABET) {
        const wheel = new Rotor(designation, ring, position);
        let roundTrip = 0;
        for (let contact = 0; contact < 26; contact += 1) {
          if (wheel.backward(wheel.forward(contact)) === contact) roundTrip += 1;
        }
        rotor(roundTrip === 26, 26);
        rotor(wheel.atTurnover === (position === specification.turnover));
        rotor(wheel.notch === specification.notch);
        const stepped = new Rotor(designation, ring, position);
        stepped.advance();
        rotor(stepped.window === ALPHABET[(ALPHABET.indexOf(position) + 1) % 26]);
      }
    }
  }

  const reflector = part('reflector');
  for (const designation of Object.keys(REFLECTORS)) {
    const reflectorUnderTest = new Reflector(designation);
    for (let contact = 0; contact < 26; contact += 1) {
      reflector(reflectorUnderTest.reflect(reflectorUnderTest.reflect(contact)) === contact);
      reflector(reflectorUnderTest.reflect(contact) !== contact);
    }
    reflector(REFLECTORS[designation].pairs.length === 13);
    reflector(new Set(REFLECTORS[designation].pairs.join('')).size === 26, 26);
    reflector(reflectorUnderTest.designation === designation);
    reflector(SOURCES[REFLECTORS[designation].source] !== undefined);
  }
  reflector(REFLECTORS.A.inServiceAtConfigurationDate === false);
  reflector(REFLECTORS.B.inServiceAtConfigurationDate === true);

  const entryWheel = part('entry wheel');
  entryWheel(SOURCES[ENTRY_WHEEL.source] !== undefined);
  const etw = new EntryWheel();
  for (let contact = 0; contact < 26; contact += 1) {
    entryWheel(etw.backward(etw.forward(contact)) === contact);
    entryWheel(etw.forward(contact) === ALPHABET.indexOf(ENTRY_WHEEL.wiring[contact]));
  }

  const plugboard = part('plugboard');
  for (let index = 0; index < 26; index += 1) {
    const a = ALPHABET[index];
    const b = ALPHABET[(index + 1) % 26];
    const c = ALPHABET[(index + 2) % 26];
    plugboard(rejects(() => new Plugboard([a + a])));
    plugboard(rejects(() => new Plugboard([a + b, a + c])));
  }
  const allPairs = [];
  for (let index = 0; index < 26; index += 2) allPairs.push(ALPHABET[index] + ALPHABET[index + 1]);
  plugboard(rejects(() => new Plugboard([...allPairs, 'AC'])));
  plugboard(new Plugboard(allPairs).selfSteckered.length === 0);
  plugboard(new Plugboard(allPairs.slice(0, 10)).selfSteckered.length === 6);
  for (const siglum of MACHINE.source) plugboard(SOURCES[siglum] !== undefined);
  plugboard(MACHINE.leadsInService === 10);
  plugboard(MACHINE.leadsMaximum === 13);
  plugboard(allPairs.length === MACHINE.leadsMaximum);
  const board = new Plugboard(allPairs.slice(0, 10));
  for (let contact = 0; contact < 26; contact += 1) {
    plugboard(board.through(board.through(contact)) === contact);
  }

  const keyboard = part('keyboard');
  keyboard([...MACHINE.keyOrder].sort().join('') === ALPHABET, 26);
  const keys = new Keyboard();
  for (const letter of ALPHABET) {
    keyboard(keys.press(letter) === letter);
    keyboard(keys.held === letter);
    keys.release();
    keyboard(keys.held === null);
  }
  keyboard(new Set(keys.order).size === 26);
  keyboard(keys.order.join('') === MACHINE.keyOrder);
  for (const absent of ['1', 'a', ' ', '', 'AB']) keyboard(rejects(() => keys.press(absent)));

  const lampboard = part('lampboard');
  const lamps = new Lampboard(keys);
  for (const letter of ALPHABET) {
    keys.press(letter);
    lampboard(lamps.connected(letter) === false);
    lampboard(lamps.light(letter) === null);
    for (const other of ALPHABET) {
      if (other !== letter) lampboard(lamps.light(other) === other);
    }
    keys.release();
  }

  const battery = part('battery');
  for (const letter of ALPHABET) {
    const dark = new EnigmaI({ wheelOrder: ['I', 'II', 'III'] });
    battery(dark.switchedOn === false);
    battery(dark.pressKey(letter) === null);
    battery(dark.windows === 'AAA');
    dark.switchOn();
    battery(dark.pressKey(letter) !== null);
    dark.switchOff();
    battery(dark.pressKey(letter) === null);
  }
  battery(new Battery().switchedOn === false);

  const stepping = part('stepping mechanism');
  for (const designation of Object.keys(ROTORS)) {
    for (const position of ALPHABET) {
      const sensed = new Rotor(designation, 'A', position);
      const driven = new Rotor(designation, 'A', 'A');
      const driving = new Pawl(driven, sensed);
      const always = new Pawl(driven);
      stepping(always.engaged === true);
      stepping(always.ratchets.length === 1);
      stepping(driving.engaged === (position === ROTORS[designation].turnover));
      stepping(driving.ratchets.length === 2);
      stepping(driving.ratchets.includes(driven) && driving.ratchets.includes(sensed));
    }
  }
  const stepper = assemble(STEPPING_VECTOR);
  for (const expected of STEPPING_VECTOR.expected) {
    stepper.pressKey('A');
    stepping(stepper.windows === expected);
  }
  const ringSweep = assemble();
  ringSweep.setPositions('ADV');
  ringSweep.pressKey('A');
  const reference = ringSweep.windows;
  for (const left of ALPHABET) {
    for (const middle of ALPHABET) {
      for (const right of ALPHABET) {
        ringSweep.setRingSettings(`${left}${middle}${right}`);
        ringSweep.setPositions('ADV');
        ringSweep.pressKey('A');
        stepping(ringSweep.windows === reference);
      }
    }
  }
  const designationList = Object.keys(ROTORS);
  for (const left of designationList) {
    for (const middle of designationList) {
      for (const right of designationList) {
        if (new Set([left, middle, right]).size !== 3) continue;
        const trial = assemble({ wheelOrder: [left, middle, right] });
        for (const l of ALPHABET) {
          for (const m of ALPHABET) {
            for (const r of ALPHABET) {
              trial.setPositions(`${l}${m}${r}`);
              const rightAtTurnover = r === ROTORS[right].turnover;
              const middleAtTurnover = m === ROTORS[middle].turnover;
              const expected =
                ALPHABET[(ALPHABET.indexOf(l) + (middleAtTurnover ? 1 : 0)) % 26] +
                ALPHABET[(ALPHABET.indexOf(m) + (middleAtTurnover || rightAtTurnover ? 1 : 0)) % 26] +
                ALPHABET[(ALPHABET.indexOf(r) + 1) % 26];
              trial.pressKey('A');
              stepping(trial.windows === expected);
            }
          }
        }
      }
    }
  }
  
  for (const designation of Object.keys(ROTORS)) {
    const others = Object.keys(ROTORS).filter((candidate) => candidate !== designation);
    const inert = assemble({
      wheelOrder: [designation, others[0], others[1]],
      positions: `${ROTORS[designation].turnover}AA`
    });
    inert.pressKey('A');
    stepping(inert.windows[0] === ROTORS[designation].turnover);
  }

  const plate = part('instruction plate');
  plate(SOURCES[PLATE.source] !== undefined);
  plate(Object.keys(PLATE_TABLE).length === 26);
  for (const letter of ALPHABET) {
    plate(plateLetter(plateNumber(letter)) === letter);
    plate(plateNumber(letter) === String(ALPHABET.indexOf(letter) + 1).padStart(2, '0'));
  }

  const machine = part('assembled machine');
  for (const left of ALPHABET) {
    const dial = assemble({ positions: `${left}AA`, ringSettings: `${left}AA` });
    machine(dial.windowNumbers.join('') === PLATE_TABLE[left] + '0101');
    machine(dial.ringSettingNumbers.join('') === PLATE_TABLE[left] + '0101');
  }
  for (const vector of VECTORS) {
    machine(run(assemble(vector), vector.input) === vector.expected, vector.input.length);
    machine(SOURCES[vector.source] !== undefined);
  }
  for (const message of MESSAGES) {
    machine(run(assemble(message), message.input) === message.expected, message.input.length);
    machine(run(assemble(message), message.expected) === message.input, message.input.length);
    machine(SOURCES[message.source] !== undefined);
  }
  const sweep = assemble();
  for (const left of ALPHABET) {
    for (const middle of ALPHABET) {
      for (const right of ALPHABET) {
        const position = `${left}${middle}${right}`;
        for (const letter of ALPHABET) {
          sweep.setPositions(position);
          machine(sweep.pressKey(letter) !== letter);
        }
      }
    }
  }
  const designations = Object.keys(ROTORS);
  let permitted = 0;
  for (const left of designations) {
    for (const middle of designations) {
      for (const right of designations) {
        const distinct = new Set([left, middle, right]).size === 3;
        const built = !rejects(() => new EnigmaI({ wheelOrder: [left, middle, right] }));
        machine(built === distinct);
        if (built) permitted += 1;
        if (!distinct) continue;
        for (const reflectorUnderTest of Object.keys(REFLECTORS)) {
          const trial = assemble({ wheelOrder: [left, middle, right], reflector: reflectorUnderTest });
          for (const letter of ALPHABET) {
            trial.setPositions('AAA');
            machine(trial.pressKey(letter) !== letter);
          }
        }
      }
    }
  }
  machine(permitted === 60);
  for (const foreign of ['VI', 'VII', 'VIII', 'Beta', 'Gamma']) {
    machine(rejects(() => new EnigmaI({ wheelOrder: ['I', 'II', foreign] })));
  }
  const keyed = assemble();
  for (const absent of ['1', 'a', ' ', '', 'AB', '.']) {
    machine(rejects(() => keyed.pressKey(absent)));
  }
  machine(keyed.wheelOrder.join('') === 'IIIIII');
  machine(keyed.reflector === 'B');
  for (const specification of Object.values(ROTORS).concat(Object.values(REFLECTORS))) {
    machine(SOURCES[specification.source] !== undefined);
  }

  return state;
};

const report = (parts) => {
  const width = Math.max(...parts.map((entry) => entry.name.length));
  for (const entry of parts) {
    const mark = entry.failures === 0 ? 'pass' : 'FAIL';
    const cases = entry.cases.toLocaleString('en');
    console.log(`  ${mark}  ${entry.name.padEnd(width)}  ${cases.padStart(9)} cases`);
  }
  const cases = parts.reduce((total, entry) => total + entry.cases, 0);
  const failed = parts.filter((entry) => entry.failures > 0).length;
  console.log(`\n  ${parts.length} parts, ${cases.toLocaleString('en')} cases, ${failed} failed\n`);
  return failed;
};

console.log('');
process.exitCode = report(verify()) === 0 ? 0 : 1;

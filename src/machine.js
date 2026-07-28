import {
  ALPHABET,
  CONTACTS,
  ROTORS,
  REFLECTORS,
  ENTRY_WHEEL,
  MACHINE,
  PLATE_TABLE
} from './wiring.js';

const CODE_A = 'A'.codePointAt(0);

const mod = (n) => ((n % CONTACTS) + CONTACTS) % CONTACTS;
const toContact = (letter) => letter.codePointAt(0) - CODE_A;
const toLetter = (contact) => String.fromCodePoint(CODE_A + contact);

export const plateNumber = (letter) => PLATE_TABLE[letter];

export const plateLetter = (number) =>
  Object.keys(PLATE_TABLE).find((letter) => PLATE_TABLE[letter] === number);

const requireLetter = (value) => {
  if (typeof value !== 'string') throw new TypeError(String(value));
  if (value.length !== 1) throw new RangeError(value);
  if (!ALPHABET.includes(value)) throw new RangeError(value);
  return value;
};

export class Rotor {
  #designation;
  #wiring;
  #inverse;
  #notch;
  #turnover;
  #ringSetting;
  #position;

  constructor(designation, ringSetting = 'A', position = 'A') {
    const specification = ROTORS[designation];
    if (specification === undefined) throw new RangeError(String(designation));
    this.#designation = designation;
    this.#wiring = Object.freeze([...specification.wiring].map(toContact));
    const inverse = new Array(CONTACTS);
    this.#wiring.forEach((to, from) => { inverse[to] = from; });
    this.#inverse = Object.freeze(inverse);
    this.#notch = specification.notch;
    this.#turnover = Object.freeze([...specification.turnover]);
    this.#ringSetting = toContact(requireLetter(ringSetting));
    this.#position = toContact(requireLetter(position));
  }

  get designation() { return this.#designation; }

  get notch() { return this.#notch; }

  get window() { return toLetter(this.#position); }

  get ringSetting() { return toLetter(this.#ringSetting); }

  get atTurnover() { return this.#turnover.includes(this.window); }

  get #offset() { return mod(this.#position - this.#ringSetting); }

  setPosition(letter) { this.#position = toContact(requireLetter(letter)); }

  setRingSetting(letter) { this.#ringSetting = toContact(requireLetter(letter)); }

  advance() { this.#position = mod(this.#position + 1); }

  forward(contact) {
    const offset = this.#offset;
    return mod(this.#wiring[mod(contact + offset)] - offset);
  }

  backward(contact) {
    const offset = this.#offset;
    return mod(this.#inverse[mod(contact + offset)] - offset);
  }
}

export class Reflector {
  #designation;
  #connections;

  constructor(designation) {
    const specification = REFLECTORS[designation];
    if (specification === undefined) throw new RangeError(String(designation));
    this.#designation = designation;
    const connections = new Array(CONTACTS);
    for (const pair of specification.pairs) {
      const a = toContact(requireLetter(pair[0]));
      const b = toContact(requireLetter(pair[1]));
      if (a === b) throw new RangeError(pair);
      if (connections[a] !== undefined || connections[b] !== undefined) throw new RangeError(pair);
      connections[a] = b;
      connections[b] = a;
    }
    for (let contact = 0; contact < CONTACTS; contact += 1) {
      if (connections[contact] === undefined) throw new RangeError(designation);
      if (connections[connections[contact]] !== contact) throw new RangeError(designation);
    }
    this.#connections = Object.freeze(connections);
  }

  get designation() { return this.#designation; }

  reflect(contact) { return this.#connections[contact]; }
}

export class EntryWheel {
  #wiring;
  #inverse;

  constructor(wiring = ENTRY_WHEEL.wiring) {
    this.#wiring = Object.freeze([...wiring].map(toContact));
    const inverse = new Array(CONTACTS);
    this.#wiring.forEach((to, from) => { inverse[to] = from; });
    this.#inverse = Object.freeze(inverse);
  }

  forward(contact) { return this.#wiring[contact]; }

  backward(contact) { return this.#inverse[contact]; }
}

export class Plugboard {
  #connections;
  #leads;

  constructor(leads = []) {
    if (!Array.isArray(leads)) throw new TypeError(String(leads));
    if (leads.length > MACHINE.leadsMaximum) throw new RangeError(String(leads.length));
    const connections = Array.from({ length: CONTACTS }, (unused, contact) => contact);
    const occupied = new Set();
    for (const lead of leads) {
      if (typeof lead !== 'string' || lead.length !== 2) throw new TypeError(String(lead));
      const a = toContact(requireLetter(lead[0]));
      const b = toContact(requireLetter(lead[1]));
      if (a === b) throw new RangeError(lead);
      if (occupied.has(a) || occupied.has(b)) throw new RangeError(lead);
      occupied.add(a);
      occupied.add(b);
      connections[a] = b;
      connections[b] = a;
    }
    this.#connections = Object.freeze(connections);
    this.#leads = Object.freeze([...leads]);
  }

  get leads() { return this.#leads; }

  get selfSteckered() {
    return [...ALPHABET].filter((letter) => this.#connections[toContact(letter)] === toContact(letter));
  }

  through(contact) { return this.#connections[contact]; }
}

export class Keyboard {
  #order;
  #held;

  constructor(order = MACHINE.keyOrder) {
    this.#order = Object.freeze([...order]);
    this.#held = null;
  }

  get order() { return this.#order; }

  get held() { return this.#held; }

  press(letter) {
    requireLetter(letter);
    if (!this.#order.includes(letter)) throw new RangeError(letter);
    this.#held = letter;
    return this.#held;
  }

  release() { this.#held = null; }
}

export class Lampboard {
  #order;
  #keyboard;

  constructor(keyboard, order = MACHINE.keyOrder) {
    this.#keyboard = keyboard;
    this.#order = Object.freeze([...order]);
  }

  get order() { return this.#order; }

  connected(letter) { return requireLetter(letter) !== this.#keyboard.held; }

  light(letter) { return this.connected(letter) ? letter : null; }
}

export class Battery {
  #switchedOn;

  constructor(switchedOn = false) { this.#switchedOn = switchedOn === true; }

  get switchedOn() { return this.#switchedOn; }

  switchOn() { this.#switchedOn = true; }

  switchOff() { this.#switchedOn = false; }
}

export class Pawl {
  #driven;
  #sensed;

  constructor(driven, sensed = null) {
    this.#driven = driven;
    this.#sensed = sensed;
  }

  get engaged() { return this.#sensed === null || this.#sensed.atTurnover; }

  get ratchets() {
    return this.#sensed === null ? [this.#driven] : [this.#driven, this.#sensed];
  }
}

export class Stepping {
  #pawls;

  constructor(rotors) {
    const [left, middle, right] = rotors;
    this.#pawls = Object.freeze([
      new Pawl(right),
      new Pawl(middle, right),
      new Pawl(left, middle)
    ]);
  }

  advance() {
    const borne = new Set();
    for (const pawl of this.#pawls) {
      if (!pawl.engaged) continue;
      for (const rotor of pawl.ratchets) borne.add(rotor);
    }
    for (const rotor of borne) rotor.advance();
  }
}

export class EnigmaI {
  #rotors;
  #reflector;
  #entryWheel;
  #plugboard;
  #keyboard;
  #lampboard;
  #battery;
  #stepping;

  constructor({
    wheelOrder,
    reflector = 'B',
    ringSettings = 'AAA',
    positions = 'AAA',
    leads = [],
    switchedOn = false
  }) {
    if (!Array.isArray(wheelOrder)) throw new TypeError(String(wheelOrder));
    if (wheelOrder.length !== MACHINE.rotorSlots) throw new RangeError(String(wheelOrder.length));
    if (new Set(wheelOrder).size !== wheelOrder.length) throw new RangeError(wheelOrder.join(''));
    if (ringSettings.length !== MACHINE.rotorSlots) throw new RangeError(ringSettings);
    if (positions.length !== MACHINE.rotorSlots) throw new RangeError(positions);

    this.#rotors = wheelOrder.map(
      (designation, slot) => new Rotor(designation, ringSettings[slot], positions[slot])
    );
    this.#reflector = new Reflector(reflector);
    this.#entryWheel = new EntryWheel();
    this.#plugboard = new Plugboard(leads);
    this.#keyboard = new Keyboard();
    this.#lampboard = new Lampboard(this.#keyboard);
    this.#battery = new Battery(switchedOn);
    this.#stepping = new Stepping(this.#rotors);
  }

  get wheelOrder() { return this.#rotors.map((rotor) => rotor.designation); }

  get windows() { return this.#rotors.map((rotor) => rotor.window).join(''); }

  get windowNumbers() { return this.#rotors.map((rotor) => plateNumber(rotor.window)); }

  get ringSettings() { return this.#rotors.map((rotor) => rotor.ringSetting).join(''); }

  get ringSettingNumbers() { return this.#rotors.map((rotor) => plateNumber(rotor.ringSetting)); }

  get reflector() { return this.#reflector.designation; }

  get plugboard() { return this.#plugboard; }

  get keyboard() { return this.#keyboard; }

  get lampboard() { return this.#lampboard; }

  get switchedOn() { return this.#battery.switchedOn; }

  switchOn() { this.#battery.switchOn(); }

  switchOff() { this.#battery.switchOff(); }

  setPositions(letters) {
    if (letters.length !== MACHINE.rotorSlots) throw new RangeError(letters);
    this.#rotors.forEach((rotor, slot) => rotor.setPosition(letters[slot]));
  }

  setRingSettings(letters) {
    if (letters.length !== MACHINE.rotorSlots) throw new RangeError(letters);
    this.#rotors.forEach((rotor, slot) => rotor.setRingSetting(letters[slot]));
  }

  pressKey(letter) {
    requireLetter(letter);
    if (!this.#battery.switchedOn) return null;

    this.#keyboard.press(letter);
    this.#stepping.advance();

    let contact = toContact(letter);
    contact = this.#plugboard.through(contact);
    contact = this.#entryWheel.forward(contact);
    for (let slot = this.#rotors.length - 1; slot >= 0; slot -= 1) {
      contact = this.#rotors[slot].forward(contact);
    }
    contact = this.#reflector.reflect(contact);
    for (let slot = 0; slot < this.#rotors.length; slot += 1) {
      contact = this.#rotors[slot].backward(contact);
    }
    contact = this.#entryWheel.backward(contact);
    contact = this.#plugboard.through(contact);

    const lamp = this.#lampboard.light(toLetter(contact));
    this.#keyboard.release();
    return lamp;
  }
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const CONTACTS = 26;

export const SOURCES = Object.freeze({
  ARTIFACT: Object.freeze({
    siglum: 'ARTIFACT',
    title: 'Chiffriermaschine',
    kind: 'artifact'
  }),
  HDVG13: Object.freeze({
    siglum: 'H.Dv.g. 13',
    title: 'Gebrauchsanleitung für die Chiffriermaschine Enigma',
    designators: 'H.Dv.g. 13, L.Dv.g. 13',
    date: '1937-01-12',
    kind: 'primary'
  }),
  HDVG14: Object.freeze({
    siglum: 'H.Dv.g. 14',
    title: 'Schlüsselanleitung zur Schlüsselmaschine Enigma',
    designators: 'H.Dv.g. 14, M.Dv.Nr. 168, L.Dv.g. 14',
    place: 'Berlin',
    publisher: 'Reichsdruckerei',
    date: '1940-01-13',
    kind: 'primary'
  }),
  CM: Object.freeze({
    siglum: 'CM',
    title: 'Enigma I',
    publisher: 'Crypto Museum',
    url: 'https://www.cryptomuseum.com/crypto/enigma/i',
    kind: 'institutional'
  }),
  TNMOC: Object.freeze({
    siglum: 'TNMOC',
    title: 'The Enigma Machine',
    publisher: 'The National Museum of Computing',
    url: 'https://www.tnmoc.org/bh-2-the-enigma-machine',
    kind: 'institutional'
  }),
  HAM: Object.freeze({
    siglum: 'HAM',
    author: 'HAMER, D.',
    title: 'Enigma rotor wiring',
    url: 'http://enigmamuseum.com/rotwirg.htm',
    kind: 'reference'
  }),
  FH: Object.freeze({
    siglum: 'FH',
    title: 'Enigma/Sample Messages',
    publisher: 'Franklin Heath Ltd Wiki',
    url: 'http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages',
    kind: 'reference'
  }),
  CONSENSUS: Object.freeze({
    siglum: 'CONSENSUS',
    title: 'Published test vectors in general circulation',
    kind: 'consensus'
  }),
  ECMA262: Object.freeze({
    siglum: 'ECMA-262',
    title: 'ECMAScript Language Specification',
    publisher: 'Ecma International',
    kind: 'standard'
  }),
  OPENJS: Object.freeze({
    siglum: 'OpenJS',
    title: 'Node.js API documentation',
    publisher: 'OpenJS Foundation',
    kind: 'implementation'
  }),
  WHATWG: Object.freeze({
    siglum: 'WHATWG',
    title: 'Console Standard',
    publisher: 'WHATWG',
    kind: 'standard'
  })
});

export const MACHINE = Object.freeze({
  designation: 'Enigma I',
  selfDesignation: 'Chiffriermaschine',
  factoryDesignators: Object.freeze(['Ch.11a', 'Ch.11f']),
  introduced: 1930,
  configurationDate: '1940-01-13',
  rotorSlots: 3,
  keyOrder: 'QWERTZUIOASDFGHJKPYXCVBNML',
  leadsInService: 10,
  leadsMaximum: 13,
  source: Object.freeze(['ARTIFACT', 'CM', 'TNMOC'])
});

export const PLATE = Object.freeze({
  source: 'ARTIFACT',
  table: Object.freeze({
    A: '01', B: '02', C: '03', D: '04', E: '05', F: '06', G: '07',
    H: '08', I: '09', J: '10', K: '11', L: '12', M: '13', N: '14',
    O: '15', P: '16', Q: '17', R: '18', S: '19', T: '20', U: '21',
    V: '22', W: '23', X: '24', Y: '25', Z: '26'
  })
});

export const PLATE_TABLE = PLATE.table;

export const ROTORS = Object.freeze({
  I: Object.freeze({
    wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    notch: 'Y',
    turnover: 'Q',
    introduced: 1930,
    source: 'HAM'
  }),
  II: Object.freeze({
    wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    notch: 'M',
    turnover: 'E',
    introduced: 1930,
    source: 'HAM'
  }),
  III: Object.freeze({
    wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    notch: 'D',
    turnover: 'V',
    introduced: 1930,
    source: 'HAM'
  }),
  IV: Object.freeze({
    wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    notch: 'R',
    turnover: 'J',
    introduced: 1938,
    source: 'HAM'
  }),
  V: Object.freeze({
    wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    notch: 'H',
    turnover: 'Z',
    introduced: 1938,
    source: 'HAM'
  })
});

export const REFLECTORS = Object.freeze({
  A: Object.freeze({
    pairs: Object.freeze(['AE', 'BJ', 'CM', 'DZ', 'FL', 'GY', 'HX', 'IV', 'KW', 'NR', 'OQ', 'PU', 'ST']),
    withdrawn: 1937,
    inServiceAtConfigurationDate: false,
    source: 'HAM'
  }),
  B: Object.freeze({
    pairs: Object.freeze(['AY', 'BR', 'CU', 'DH', 'EQ', 'FS', 'GL', 'IP', 'JX', 'KN', 'MO', 'TZ', 'VW']),
    inServiceAtConfigurationDate: true,
    source: 'HAM'
  }),
  C: Object.freeze({
    pairs: Object.freeze(['AF', 'BV', 'CP', 'DJ', 'EI', 'GO', 'HY', 'KR', 'LZ', 'MX', 'NW', 'QT', 'SU']),
    inServiceAtConfigurationDate: null,
    source: 'HAM'
  })
});

export const ENTRY_WHEEL = Object.freeze({
  wiring: ALPHABET,
  source: 'CM'
});

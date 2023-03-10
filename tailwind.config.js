/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'zpw-',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    spacing: {
      0: '0',
      half: '50%',
      full: '100%',
      '1/4': '2px',
      '1/2': '4px',
      1: '8px',
      2: '16px',
      3: '24px',
      4: '32px',
      5: '40px',
      6: '48px',
      7: '56px',
      8: '64px',
      9: '72px',
      10: '80px',
      11: '88px',
      40: '320px',
      50: '400px',
      75: '600px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      blue: {
        10: '#F2F8FF',
        20: '#D0E3FB',
        30: '#A8CCF8',
        40: '#7AB1F4',
        50: '#4793F1',
        60: '#0E72ED',
        70: '#0956B5',
        80: '#033A7D',
        90: '#001F45',
        100: '#00060D'
      },
      gray: {
        10: '#F7F9FA',
        20: '#F1F4F6',
        30: '#DFE3E8',
        40: '#C1C6CE',
        50: '#98A0A9',
        60: '#6E7680',
        70: '#444B53',
        80: '#252A30',
        90: '#131619',
        100: '#090B0D'
      },
      brand: {
        blue: '#2D8CFF',
        purple: '#925DFF'
      },
      red: {
        10: '#FFF2F5',
        20: '#FAD1D9',
        30: '#F6AAB8',
        40: '#F17E93',
        50: '#ED4D6A',
        60: '#E8173D',
        70: '#B10E2C',
        80: '#7A051B',
        90: '#44010D',
        100: '#0D0002'
      },
      gold: {
        10: '#FFF9F2',
        20: '#F0DCC4',
        30: '#E1BD93',
        40: '#D19F61',
        50: '#C28030',
        60: '#B36200',
        70: '#894C01',
        80: '#603400',
        90: '#361E00',
        100: '#0D0700'
      },
      green: {
        10: '#F2FFF6',
        20: '#C9E7D2',
        30: '#9ECEAD',
        40: '#74B688',
        50: '#4B9D64',
        60: '#268543',
        70: '#17672F',
        80: '#0A491D',
        90: '#022B0F',
        100: '#000D04'
      },
      orange: {
        10: '#FFF7F2',
        20: '#FFD1B9',
        30: '#FFAB81',
        40: '#FF8548',
        50: '#FF5F0F',
        60: '#CF4B0A',
        70: '#9E3806',
        80: '#6E2603',
        90: '#3D1501',
        100: '#0D0400'
      },
      teal: {
        10: '#F2FFFE',
        20: '#ADE9E7',
        30: '#70D4CF',
        40: '#3DBEB8',
        50: '#2BA09B',
        60: '#1C837E',
        70: '#106561',
        80: '#084845',
        90: '#022A28',
        100: '#000D0C'
      }
    },
    fontSize: {
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      22: '22px',
      24: '24px',
      26: '26px',
      28: '28px',
      32: '32px',
      36: '36px',
      40: '40px',
      46: '46px',
      52: '52px',
      58: '58px'
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  plugins: []
}

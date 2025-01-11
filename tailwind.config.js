/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		backgroundImage: {
  			'quick-access': 'linear-gradient(142.7deg, rgba(202, 98, 239, 0.105) -31.6%, rgba(75, 146, 251, 0.075) 36.78%, rgba(246, 192, 209, 0.09) 109.48%)'
  		},
  		colors: {
  			primary: {
  				'50': '#E6F0FF',
  				'100': '#CCE0FF',
  				'200': '#99C2FF',
  				'300': '#66A3FF',
  				'400': '#3385FF',
  				'500': '#1774FD',
  				'600': '#0055CC',
  				'700': '#004099',
  				'800': '#002B66',
  				'900': '#001633',
  				DEFAULT: '#1774FD'
  			},
  			secondary: {
  				'50': '#E6F0FF',
  				'100': '#CCE0FF',
  				'200': '#99C2FF',
  				'300': '#66A3FF',
  				'400': '#3385FF',
  				'500': '#1774FD',
  				'600': '#0055CC',
  				'700': '#e5e7eb',
  				'800': '#002B66',
  				'900': '#001633',
  				DEFAULT: '#1774FD'
  			},
  			gray: {
  				'50': '#F2F4F7',
  				'100': '#E5E5E5',
  				'200': '#CCCCCC',
  				'300': '#B3B3B3',
  				'400': '#999999',
  				'500': '#828282',
  				'600': '#666666',
  				'700': '#4D4D4D',
  				'800': '#333333',
  				'900': '#101828',
  				DEFAULT: '#828282'
  			},
  			destructive: {
  				'50': '#FFF1F0',
  				'100': '#FFCCC7',
  				'200': '#FFA39E',
  				'300': '#FF7875',
  				'400': '#FF4D4F',
  				'500': '#F5222D',
  				'600': '#CF1322',
  				'700': '#A8071A',
  				'800': '#820014',
  				'900': '#5C0011',
  				DEFAULT: '#FF4D4F'
  			},
  			success: {
  				'50': '#F6FFED',
  				'100': '#D9F7BE',
  				'200': '#B7EB8F',
  				'300': '#95DE64',
  				'400': '#73D13D',
  				'500': '#52C41A',
  				'600': '#389E0D',
  				'700': '#237804',
  				'800': '#135200',
  				'900': '#092B00',
  				DEFAULT: '#52C41A'
  			},
  			background: {
  				light: '#FFFFFF',
  				dark: '#1A1A1A'
  			},
  			chatBrown: '#F2F4F7',
  			ant: '#EAF5FF42',
  			dBrown: '#665300',
  			dAsh: '#FBFCFE',
  			darkBrown: '#665301',
  			lightGold: '#FFF9E0',
  			newAsh: '#F8F8F8',
  			bamboo: '#052C67',
  			PRIMARY: '#1774FD',
  			SECONDARY: '#A7A7A7',
  			ACTIVE: 'rgba(223, 248, 231, 0.30)',
  			DISABLED: 'rgba(167, 167, 167, 0.27)',
  			MODAL_BACKGROUND: 'rgba(0, 0, 0, 0.23)',
  			NOTIFICATION: 'rgba(222, 235, 255, 0.20)',
  			NOTIFICATIONREAD: 'rgba(242, 242, 242, 0.20)',
  			skyBlue: '#3C6EB7',
  			skyBlue1: '#F4F9FF',
  			skyBlue2: '#1774FD1C',
  			BLACK: {
  				_100: '#000',
  				_150: '#D7D7D7',
  				_160: '#7D7D7D',
  				_200: ' #7F7F81',
  				_300: '#828282',
  				_400: '#E5E5E5',
  				_500: '#121212',
  				_600: '#101828',
  				_700: '#525A63',
  				_800: '#868686',
  				_900: '#111017',
  				_1000: '#565656'
  			},
  			WHITE: {
  				_100: '#FFF',
  				_200: '#EBEBEB',
  				_300: '#F7F7F7',
  				_400: '#D5D9E0',
  				_500: '#F2F2F2'
  			},
  			BLUE: {
  				'50': '#D7E7FF',
  				_100: '#0359D8',
  				_200: '#1774FD',
  				_300: '#BDD8FF'
  			},
  			GREEN: {
  				_100: '#057601',
  				_200: '#4BC747',
  				_300: '#47FC41'
  			},
  			RED: {
  				_100: '#AF202D'
  			},
  			grey: {
  				'100': '#555555',
  				'200': '#FAFBFC',
  				'300': '#EEEFF0',
  				'400': '#D1D1D180',
  				default: '#FFFFFF'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Figtree',
  				'Inter',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

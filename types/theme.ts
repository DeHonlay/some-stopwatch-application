export interface Theme {
  id: string;
  name: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      primary: string;
      secondary: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    timer: {
      focus: string;
      shortBreak: string;
      longBreak: string;
      custom: string[];
    };
  };
}

export const themes: Theme[] = [
  {
    id: 'default-dark',
    name: 'Default Dark',
    isDark: true,
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: {
        primary: '#1a1a1a',
        secondary: '#2a2a2a',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#999999',
      },
      timer: {
        focus: '#4A90E2',
        shortBreak: '#50E3C2',
        longBreak: '#FF9500',
        custom: [
          '#FF3B30', // Red - High intensity
          '#5856D6', // Purple - Medium intensity
          '#FF2D55', // Pink - High intensity
          '#64D2FF', // Light Blue - Medium intensity
          '#FFCC00'  // Yellow - High intensity
        ],
      },
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    isDark: true,
    colors: {
      primary: '#00B4D8',
      secondary: '#48CAE4',
      accent: '#90E0EF',
      background: {
        primary: '#03045E',
        secondary: '#023E8A',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#CAF0F8',
      },
      timer: {
        focus: '#00B4D8',
        shortBreak: '#90E0EF',
        longBreak: '#48CAE4',
        custom: [
          '#0077B6', // Deep Blue
          '#90E0EF', // Light Blue
          '#00B4D8', // Medium Blue
          '#CAF0F8', // Very Light Blue
          '#023E8A'  // Navy Blue
        ],
      },
    },
  },
  {
    id: 'forest-light',
    name: 'Forest Light',
    isDark: false,
    colors: {
      primary: '#2D6A4F',
      secondary: '#40916C',
      accent: '#74C69D',
      background: {
        primary: '#F0FFF4',
        secondary: '#D8F3DC',
      },
      text: {
        primary: '#1B4332',
        secondary: '#2D6A4F',
      },
      timer: {
        focus: '#2D6A4F',
        shortBreak: '#40916C',
        longBreak: '#74C69D',
        custom: [
          '#1B4332', // Dark Green
          '#95D5B2', // Light Green
          '#2D6A4F', // Medium Green
          '#74C69D', // Soft Green
          '#40916C'  // Forest Green
        ],
      },
    },
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    isDark: true,
    colors: {
      primary: '#F72585',
      secondary: '#7209B7',
      accent: '#4CC9F0',
      background: {
        primary: '#3A0CA3',
        secondary: '#4361EE',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B5179E',
      },
      timer: {
        focus: '#F72585',
        shortBreak: '#7209B7',
        longBreak: '#4361EE',
        custom: [
          '#F72585', // Hot Pink
          '#4CC9F0', // Light Blue
          '#7209B7', // Purple
          '#4361EE', // Blue
          '#B5179E'  // Deep Pink
        ],
      },
    },
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    isDark: false,
    colors: {
      primary: '#2B2D42',
      secondary: '#8D99AE',
      accent: '#EF233C',
      background: {
        primary: '#EDF2F4',
        secondary: '#FFFFFF',
      },
      text: {
        primary: '#2B2D42',
        secondary: '#8D99AE',
      },
      timer: {
        focus: '#2B2D42',
        shortBreak: '#8D99AE',
        longBreak: '#EF233C',
        custom: [
          '#2B2D42', // Dark Blue
          '#8D99AE', // Gray Blue
          '#EF233C', // Red
          '#D90429', // Dark Red
          '#A9A9A9'  // Gray
        ],
      },
    },
  },
];
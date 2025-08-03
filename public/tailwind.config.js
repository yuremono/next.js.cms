tailwind.config = {
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        // Margin
        '.mt4': { 'margin-top': '4px' },
        '.mt8': { 'margin-top': '8px' },
        '.mt12': { 'margin-top': '12px' },
        '.mt16': { 'margin-top': '16px' },
        '.mb4': { 'margin-bottom': '4px' },
        '.mb8': { 'margin-bottom': '8px' },
        '.mb12': { 'margin-bottom': '12px' },
        '.mb16': { 'margin-bottom': '16px' },
        // Padding
        '.p4': { 'padding': '4px' },
        '.p8': { 'padding': '8px' },
        '.p12': { 'padding': '12px' },
        '.p16': { 'padding': '16px' },
        '.py4': { 'padding-top': '4px', 'padding-bottom': '4px' },
        '.py8': { 'padding-top': '8px', 'padding-bottom': '8px' },
        '.py12': { 'padding-top': '12px', 'padding-bottom': '12px' },
        '.py16': { 'padding-top': '16px', 'padding-bottom': '16px' },
        '.px4': { 'padding-left': '4px', 'padding-right': '4px' },
        '.px8': { 'padding-left': '8px', 'padding-right': '8px' },
        '.px12': { 'padding-left': '12px', 'padding-right': '12px' },
        '.px16': { 'padding-left': '16px', 'padding-right': '16px' },
        // Font Size
        '.text12': { 'font-size': '12px' },
        '.text14': { 'font-size': '14px' },
        '.text16': { 'font-size': '16px' },
        '.text24': { 'font-size': '24px' },
        // Border Radius
        '.rounded4': { 'border-radius': '4px' },
        '.rounded8': { 'border-radius': '8px' },
        '.rounded12': { 'border-radius': '12px' },
        '.rounded16': { 'border-radius': '16px' },
        // Gap
        '.gap4': { 'gap': '4px' },
        '.gap8': { 'gap': '8px' },
        '.gap12': { 'gap': '12px' },
        '.gap16': { 'gap': '16px' },
        // Width
        '.w80': { 'width': '80px' },
        '.w120': { 'width': '120px' },
        '.w160': { 'width': '160px' },
        '.w240': { 'width': '240px' },
        '.w320': { 'width': '320px' },
        // Height
        '.h40': { 'height': '40px' },
        '.h80': { 'height': '80px' },
        '.h120': { 'height': '120px' },
        '.h160': { 'height': '160px' },
        '.h240': { 'height': '240px' }
      }
      addUtilities(newUtilities)
    }
  ]
}
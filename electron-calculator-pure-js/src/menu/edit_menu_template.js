export default ({ openSimpleCalculator, openScientificCalculator }) => ({
  label: "Mode",
  submenu: [{
      label: "Simple",
      accelerator: "Alt+S",
      click: openSimpleCalculator
    },
    {
      label: "Scientific",
      accelerator: "Alt+C",
      click: openScientificCalculator
    },
    {
      type: "separator"
    }
  ]
});
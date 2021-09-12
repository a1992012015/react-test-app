const routerTransition = {
  '/dashboard': 0,
  '/go-bang': 1
};

const transitionList = [
  {
    enter: 'from-opacity',
    exit: 'to-opacity'
  },
  {
    enter: 'from-right',
    exit: 'to-right'
  },
  {
    enter: 'from-bottom',
    exit: 'to-bottom'
  }
];

export { routerTransition, transitionList };

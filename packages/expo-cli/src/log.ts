import chalk from 'chalk';
import program from 'commander';

type Color = (...text: string[]) => string;

let _bundleProgressBar: any;
let _oraSpinner: any;

let _printNewLineBeforeNextLog = false;
let _isLastLineNewLine = false;
function _updateIsLastLineNewLine(args: any[]) {
  if (args.length === 0) {
    _isLastLineNewLine = true;
  } else {
    let lastArg = args[args.length - 1];
    if (typeof lastArg === 'string' && (lastArg === '' || lastArg.match(/[\r\n]$/))) {
      _isLastLineNewLine = true;
    } else {
      _isLastLineNewLine = false;
    }
  }
}

function _maybePrintNewLine() {
  if (_printNewLineBeforeNextLog) {
    _printNewLineBeforeNextLog = false;
    console.log();
  }
}

function consoleLog(...args: any[]) {
  _maybePrintNewLine();
  _updateIsLastLineNewLine(args);

  console.log(...args);
}

function consoleWarn(...args: any[]) {
  _maybePrintNewLine();
  _updateIsLastLineNewLine(args);

  console.warn(...args);
}

function consoleError(...args: any[]) {
  _maybePrintNewLine();
  _updateIsLastLineNewLine(args);

  console.error(...args);
}

function respectProgressBars(commitLogs: () => void) {
  if (_bundleProgressBar) {
    _bundleProgressBar.terminate();
    _bundleProgressBar.lastDraw = '';
  }
  if (_oraSpinner) {
    _oraSpinner.stop();
  }
  commitLogs();

  if (_bundleProgressBar) {
    _bundleProgressBar.render();
  }
  if (_oraSpinner) {
    _oraSpinner.start();
  }
}

function getPrefix(chalkColor: Color) {
  return chalkColor(`[${new Date().toTimeString().slice(0, 8)}]`);
}

function withPrefixAndTextColor(args: any[], chalkColor: Color = chalk.gray) {
  if (program.nonInteractive) {
    return [getPrefix(chalkColor), ...args.map((arg) => chalkColor(arg))];
  } else {
    return args.map((arg) => chalkColor(arg));
  }
}

function withPrefix(args: any[], chalkColor = chalk.gray) {
  if (program.nonInteractive) {
    return [getPrefix(chalkColor), ...args];
  } else {
    return args;
  }
}

function log(...args: any[]) {
  respectProgressBars(() => {
    consoleLog(...withPrefix(args));
  });
}

log.nested = function (message: any) {
  respectProgressBars(() => {
    consoleLog(message);
  });
};

log.newLine = function newLine() {
  respectProgressBars(() => {
    consoleLog();
  });
};

log.addNewLineIfNone = function addNewLineIfNone() {
  if (!_isLastLineNewLine && !_printNewLineBeforeNextLog) {
    log.newLine();
  }
};

log.printNewLineBeforeNextLog = function printNewLineBeforeNextLog() {
  _printNewLineBeforeNextLog = true;
};

log.setBundleProgressBar = function setBundleProgressBar(bar: any) {
  _bundleProgressBar = bar;
};

log.setSpinner = function setSpinner(oraSpinner: any) {
  _oraSpinner = oraSpinner;
};

log.error = function error(...args: any[]) {
  respectProgressBars(() => {
    consoleError(...withPrefixAndTextColor(args, chalk.red));
  });
};

log.nestedError = function (message: string) {
  respectProgressBars(() => {
    consoleError(chalk.red(message));
  });
};

log.warn = function warn(...args: any[]) {
  respectProgressBars(() => {
    consoleWarn(...withPrefixAndTextColor(args, chalk.yellow));
  });
};

log.nestedWarn = function (message: string) {
  respectProgressBars(() => {
    consoleWarn(chalk.yellow(message));
  });
};

log.gray = function (...args: any[]) {
  respectProgressBars(() => {
    consoleLog(...withPrefixAndTextColor(args));
  });
};

log.chalk = chalk;

export default log;

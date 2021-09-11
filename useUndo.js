import { useEffect, useState } from 'react';

/**
 * @param  {Function} resolveMethod
 * @returns {Function} undoMethod -> callback to undo method execution
 * @returns {Function} invokeUndoMethod -> callback to initialize the useUndo
 * @returns {Boolean} isMethodExecuted -> check if @resolveMethod execution is completed or not
 */

const useUndo = (resolveMethod) => {
  const [invokeUndo, setInvokeUndo] = useState(null);
  const [undoTimerId, setUndoTimerId] = useState(null);
  const [isMethodExecuted, setMethodExecuted] = useState(false);

  const onUnload = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-return-assign
    return e.returnValue = '?';
  };

  useEffect(() => {
    if (invokeUndo) {
      window.addEventListener('beforeunload', onUnload);
      const timerId = setTimeout(() => {
        resolveMethod();
        setUndoTimerId(null);
        setMethodExecuted(true);
        setInvokeUndo(false);
      }, 10000);
      setUndoTimerId(timerId);
    }

    return () => window.removeEventListener('beforeunload', onUnload);
  }, [invokeUndo]);

  const invokeUndoMethod = () => setInvokeUndo(true);

  const undoMethod = () => {
    clearTimeout(undoTimerId);
    setInvokeUndo(false);
  };

  return [undoMethod, invokeUndoMethod, isMethodExecuted];
};

export default useUndo;

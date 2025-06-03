export const LetterWrapper = ({
    title = '',
    spaceClassName,
    letterClassName = 'letter',
  }) => {
    return (
      <div className="overflow-hidden inline-block">
        {title.split('').map((char, index, arr) => {
          if (char !== ' ') {
            const previousChar = arr[index - 1];
            const spanClass = previousChar === ' ' ? spaceClassName : '';
            const combinedClassName = `${letterClassName} ${spanClass}`.trim();
            return (
              <span key={index} className={combinedClassName || undefined}>
                {char}
              </span>
            );
          }
          return (
            <span key={index} className={spaceClassName} aria-hidden="true">
              &nbsp;
            </span>
          );
        })}
      </div>
    );
  };
  
export const countWords = (text: string): number => {
  const regex =
    /([^\x00-\x40\x5B-\x60\x7B-\xBF\u02B0-\u036F\u00D7\u00F7\u2000-\u2BFF])+/gu;

  return (text.match(regex) || []).length;
};

export const calcAndAddPastedText = (
  clipboardEvent: ClipboardEvent,
  addWordsToFileCount: (words: number) => void,
) => {
  if (clipboardEvent.defaultPrevented) return;

  clipboardEvent.preventDefault();

  const pastedText = clipboardEvent.clipboardData?.getData("text");

  if (pastedText) {
    let wordsCount = countWords(pastedText);

    // Checking whether the pasting was done on a new line or not, is useful for not adding more words that should be to the userData
    const target = (clipboardEvent.target as HTMLElement).innerHTML;
    if (target) wordsCount--;

    addWordsToFileCount(wordsCount);
  }
};

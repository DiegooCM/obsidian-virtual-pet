export const countWords = (text: string): number => {
	// TODO: Change regexp, is causing errors:
	const regex =
		/([^\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u02B0-\u036F\u00D7\u00F7\u2000-\u2BFF])+/g;

	return (text.match(regex) || []).length;
};

export const calcAndAddPastedText = (clipboardEvent: ClipboardEvent, addWordsToFileCount: (words: number) => void) => {
  const pastedText = clipboardEvent.clipboardData?.getData('text')
 
  if(pastedText) {
    let wordsCount = countWords(pastedText)

    // Checking whether the pasting was done on a new line or not, is useful for not adding more words that should be to the userData
    const target = (clipboardEvent.target as HTMLElement).innerHTML
    if (target) wordsCount-- 

    addWordsToFileCount(wordsCount)
  }
}

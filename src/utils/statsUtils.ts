export const countWords = (text: string) => {
	// TODO: Change regexp, is causing errors:
	const regex =
		/([^\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u02B0-\u036F\u00D7\u00F7\u2000-\u2BFF])+/g;

	return (text.match(regex) || []).length;
};

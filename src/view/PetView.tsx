import { App, View } from "obsidian";
import { UserStats } from "src/stats/Stats";

interface Props {
	app: App;
	view: View;
	stats: UserStats;
}

export const PetView: React.FC<Props> = ({ app, view, stats }) => {
	return (
		<>
			<p>Files Count = {stats.filesCount}</p>
			<p>Actual File Word Count = {stats.actualFileWordCount}</p>
		</>
	);
};

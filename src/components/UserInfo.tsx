import { UserData, UserStats } from "src/types";

interface UserInfo {
	userData: UserData;
	userStats: UserStats;
}

export default function UserInfo({ userData, userStats }: UserInfo) {
	return (
		<>
			<div className="actual-Data">
				<h1> Actual Data</h1>
				<p>Files Count: {userData.filesCount}</p>
				<p>
					Actual File Word Count:
					{userData.fileWordCount}
				</p>
			</div>
			<div className="user-stats">
				<h1> User Stats</h1>
				<p>Exp: {userStats.exp}</p>
				<p>Exp Goal: {userStats.expGoal}</p>
				<p>Level: {userStats.level}</p>
			</div>
		</>
	);
}

import { getServerSession } from "next-auth";

export async function Dashboard() {
	const session = await getServerSession();
	return (
		<>
			<h1>U are logged in</h1>
			<p>{session.user.name}</p>
			<p>{session.user.email}</p>
			<p>{session.user.role}</p>
		</>
	);
}

export default Dashboard;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { JazzProvider } from "jazz-react";
import { JazzAccount } from "./schema";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import GameEditor from "./pages/GameEditor";
import CharactersManager from "./pages/CharactersManager";
import EquipmentManager from "./pages/EquipmentManager";
import MonstersManager from "./pages/MonstersManager";
import EffectsManager from "./pages/EffectsManager";
import RuleBookEditor from "./pages/RuleBookEditor";

function App() {
	return (
		<JazzProvider
			sync={{ peer: "wss://cloud.jazz.tools/?key=your-email@example.com" }}
			AccountSchema={JazzAccount}
		>
			<Router>
				<div className="min-h-screen bg-background">
					<Navbar />
					<div className="container mx-auto px-4 py-8">
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/game" element={<GameEditor />} />
							<Route path="/characters" element={<CharactersManager />} />
							<Route path="/equipment" element={<EquipmentManager />} />
							<Route path="/monsters" element={<MonstersManager />} />
							<Route path="/effects" element={<EffectsManager />} />
							<Route path="/rulebook" element={<RuleBookEditor />} />
						</Routes>
					</div>
				</div>
			</Router>
		</JazzProvider>
	);
}

export default App;

// Register the Account schema so `useAccount` returns our custom `JazzAccount`
declare module "jazz-react" {
	interface Register {
		Account: JazzAccount;
	}
}

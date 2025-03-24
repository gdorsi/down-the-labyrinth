import { Router, Route, RootRoute, Outlet } from "@tanstack/react-router"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { MonsterDetail } from "./pages/monsters/MonsterDetail"
import { EquipmentDetail } from "./pages/equipment/EquipmentDetail"
import { AbilityDetail } from "./pages/abilities/AbilityDetail"
import { CharacterDetail } from "./pages/characters/CharacterDetail"
import { MonstersList } from "./pages/monsters/MonstersList"
import { EquipmentList } from "./pages/equipment/EquipmentList"
import { AbilitiesList } from "./pages/abilities/AbilitiesList"
import { CharactersList } from "./pages/characters/CharactersList"

// Define the root route
const rootRoute = new RootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

// Define the routes
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
})

// Monsters routes
const monstersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "monsters",
  component: () => <MonstersList />,
})

const monstersIndexRoute = new Route({
  getParentRoute: () => monstersRoute,
  path: "/",
  component: () => (
    <div className="hidden lg:block bg-gray-50 rounded-lg p-6 text-center text-gray-500">
      Select a monster to view details
    </div>
  ),
})

const monsterDetailRoute = new Route({
  getParentRoute: () => monstersRoute,
  path: "$monsterId",
  component: MonsterDetail,
})

// Equipment routes
const equipmentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "equipment",
  component: () => <EquipmentList />,
})

const equipmentIndexRoute = new Route({
  getParentRoute: () => equipmentRoute,
  path: "/",
  component: () => (
    <div className="hidden lg:block bg-gray-50 rounded-lg p-6 text-center text-gray-500">
      Select equipment to view details
    </div>
  ),
})

const equipmentDetailRoute = new Route({
  getParentRoute: () => equipmentRoute,
  path: "$equipmentId",
  component: EquipmentDetail,
})

// Abilities routes
const abilitiesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "abilities",
  component: () => <AbilitiesList />,
})

const abilitiesIndexRoute = new Route({
  getParentRoute: () => abilitiesRoute,
  path: "/",
  component: () => (
    <div className="hidden lg:block bg-gray-50 rounded-lg p-6 text-center text-gray-500">
      Select an ability to view details
    </div>
  ),
})

const abilityDetailRoute = new Route({
  getParentRoute: () => abilitiesRoute,
  path: "$abilityId",
  component: AbilityDetail,
})

// Characters routes
const charactersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "characters",
  component: () => <CharactersList />,
})

const charactersIndexRoute = new Route({
  getParentRoute: () => charactersRoute,
  path: "/",
  component: () => (
    <div className="hidden lg:block bg-gray-50 rounded-lg p-6 text-center text-gray-500">
      Select a character to view details
    </div>
  ),
})

const characterDetailRoute = new Route({
  getParentRoute: () => charactersRoute,
  path: "$characterId",
  component: CharacterDetail,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  monstersRoute.addChildren([monstersIndexRoute, monsterDetailRoute]),
  equipmentRoute.addChildren([equipmentIndexRoute, equipmentDetailRoute]),
  abilitiesRoute.addChildren([abilitiesIndexRoute, abilityDetailRoute]),
  charactersRoute.addChildren([charactersIndexRoute, characterDetailRoute]),
])

// Create the router
export const router = new Router({ routeTree })

// Register the router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}


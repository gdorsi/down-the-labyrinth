import { Link } from "@tanstack/react-router"
import { useAccount } from "jazz-react"
import { useState } from "react"
import type { ReactNode } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AuthButton } from "./AuthButton"

export function Layout({ children }: { children: ReactNode }) {
  const { me } = useAccount({
    resolve: {
      root: {
        game: true,
      },
    },
  })
  const [isOpen, setIsOpen] = useState(false)

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-white p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{me.root.game.name}</h1>
        <div className="flex items-center gap-2">
          <AuthButton />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{me.root.game.name}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                      activeProps={{ className: "bg-blue-100 text-blue-700" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/monsters"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                      activeProps={{ className: "bg-blue-100 text-blue-700" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Monsters
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/equipment"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                      activeProps={{ className: "bg-blue-100 text-blue-700" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Equipment
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/abilities"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                      activeProps={{ className: "bg-blue-100 text-blue-700" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Abilities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/characters"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                      activeProps={{ className: "bg-blue-100 text-blue-700" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Characters
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-md h-full overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">{me.root.game.name}</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
                activeProps={{ className: "bg-blue-100 text-blue-700" }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/monsters"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
                activeProps={{ className: "bg-blue-100 text-blue-700" }}
              >
                Monsters
              </Link>
            </li>
            <li>
              <Link
                to="/equipment"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
                activeProps={{ className: "bg-blue-100 text-blue-700" }}
              >
                Equipment
              </Link>
            </li>
            <li>
              <Link
                to="/abilities"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
                activeProps={{ className: "bg-blue-100 text-blue-700" }}
              >
                Abilities
              </Link>
            </li>
            <li>
              <Link
                to="/characters"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
                activeProps={{ className: "bg-blue-100 text-blue-700" }}
              >
                Characters
              </Link>
            </li>
          </ul>
          <div className="pt-4 border-t">
            <AuthButton />
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto w-full h-[calc(100vh-64px)] md:h-screen">
        <div className="p-4 md:p-6 h-full">{children}</div>
      </div>
    </div>
  )
}


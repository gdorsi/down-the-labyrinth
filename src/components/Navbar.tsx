import { Link } from "react-router-dom"
import { useAccount, useIsAuthenticated } from "jazz-react"
import { useState } from "react"
import AuthModal from "./AuthModal"
import PassphraseModal from "./PassphraseModal"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  const { logOut } = useAccount()
  const isAuthenticated = useIsAuthenticated()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [passphraseModalOpen, setPassphraseModalOpen] = useState(false)
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">Game Manager</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Entities</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/characters"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Characters</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage your game characters
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/equipment"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Equipment</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage weapons, armor and artifacts
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/monsters"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Monsters</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage monsters and bosses
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/effects"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Effects</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage card effects
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/rulebook">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Rulebook</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPassphraseModalOpen(true)}>
                  Manage Passphrase
                </Button>
                <Button variant="outline" size="sm" onClick={logOut}>
                  Log Out
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <PassphraseModal open={passphraseModalOpen} onOpenChange={setPassphraseModalOpen} />
    </nav>
  )
}


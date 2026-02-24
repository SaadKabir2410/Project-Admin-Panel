import { useState } from "react"
import { useTheme } from "../../context/ThemeContext"
import { Bell, ChevronDown, ChevronRight, Globe, Home, LayoutGrid, Menu, Moon, Search, Sun, X } from "lucide-react"

function IconBtn({ children, className = "", badge = false, onClick, title = "" }) {
     return (
          <button
               onClick={onClick}
               title={title}
               className={`relative p-1 rounded hover:bg-slate-200/50 dark:hover:bg-white/10 ${className}`}>
               {children}
               {badge && <span
                    className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1a1f2e]" />}
          </button>
     )
}

export default function Navbar({ Collapsed, setCollapsed }) {
     const { dark, setDark } = useTheme()
     const [searchVal, setSearchVal] = useState("")
     return (
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5">
               <div className="flex items-center gap-4">
                    <IconBtn onClick={() => setCollapsed(c => !c)} title="toggle sidebar" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                         <Menu size={20} />
                    </IconBtn>

                    <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all group">
                         <Search size={16} className="text-slate-400 group-focus-within:text-blue-500" />
                         <input type="text" value={searchVal}
                              onChange={(e) => setSearchVal(e.target.value)}
                              placeholder="Search..."
                              className="bg-transparent border-none text-sm outline-none w-48 focus:w-64 transition-all dark:text-slate-200"
                         />
                         {searchVal && (
                              <button onClick={() => setSearchVal("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                   <X size={14} />
                              </button>
                         )}
                    </div>

                    <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden lg:block" />

                    <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                         <Home size={14} />
                         <ChevronRight size={12} />
                         <span className="text-slate-600 dark:text-slate-300 capitalize">
                              {window.location.pathname === '/' ? 'Dashboard' : window.location.pathname.split('/').pop().replace(/-/g, ' ')}
                         </span>
                    </div>
               </div>

               <div className="flex items-center gap-1.5 ml-auto">
                    <IconBtn onClick={() => setDark(dark === "light" ? "dark" : "light")} title="toggle theme">
                         {dark === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
                    </IconBtn>

                    <IconBtn title="Language" className="hidden sm:flex">
                         <Globe size={19} className="text-slate-600 dark:text-slate-400" />
                    </IconBtn>

                    <IconBtn badge title="Notifications">
                         <Bell size={19} className="text-slate-600 dark:text-slate-400" />
                    </IconBtn>

                    <IconBtn title="Apps" className="hidden sm:flex">
                         <LayoutGrid size={19} className="text-slate-600 dark:text-slate-400" />
                    </IconBtn>

                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2" />

                    <button className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] text-white font-bold shadow-sm">
                              SK
                         </div>
                         <div className="text-left hidden lg:block">
                              <p className="text-xs font-bold dark:text-slate-200">Saad Kabir</p>
                              <p className="text-[10px] text-slate-500 font-medium">System Admin</p>
                         </div>
                         <ChevronDown size={14} className="text-slate-400" />
                    </button>
               </div>
          </header>
     )
}
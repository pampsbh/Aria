import { MessageSquare, History } from 'lucide-react';
import svgPaths from "../imports/svg-i1h818p142";
import imgIucone11 from "figma:asset/0220e768db776c8dcecde81a77533d004a33b00a.png";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { id: 'desdobramentos', label: 'Solicitações', icon: <MessageSquare size={20} /> },
  { id: 'historico', label: 'Histórico', icon: <History size={20} /> },
];

type SidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="bg-[#2B313B] h-screen w-[240px] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#3a424f]">
        <div className="flex items-center gap-3">
          <div className="h-[35.849px] w-[24.411px] relative shrink-0">
            <img 
              alt="Aria Logo" 
              src={imgIucone11} 
              className="w-full h-full object-contain" 
            />
          </div>
          <span className="text-white text-[20px] font-['Lato:Medium_Italic',sans-serif] italic">
            Aria
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-6 py-3 transition-colors
              ${activeSection === item.id 
                ? 'bg-[#0061d6] text-white' 
                : 'text-[#a5abab] hover:bg-[#3a424f] hover:text-white'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#3a424f] text-[#717979] text-[12px]">
        <p>Opera Integration</p>
        <p className="text-[10px] mt-1">v1.0.0</p>
      </div>
    </div>
  );
}
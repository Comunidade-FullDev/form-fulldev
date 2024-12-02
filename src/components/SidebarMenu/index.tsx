import Image from "next/image";
import { Button } from "../ui/button";
import { FileEdit, Share2, Trash2 } from "lucide-react";

const SidebarMenu = () => (
    <div className="w-64 bg-card p-6">
      <div className="mb-8">
        <Image src="/LogoWhite.svg" width={50} height={50} alt='Logo' />
      </div>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start bg-gray-900">
          <FileEdit color="white" className="mr-2 h-4 w-4" />
          Meus formulários
        </Button>
   
      </nav>
      <div className="border-l border-border h-full ml-4 mt-4" />
    </div>
  );

  export default SidebarMenu;